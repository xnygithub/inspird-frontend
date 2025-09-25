"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { getS3UploadUrl } from "@/app/actions/s3";
import { getImageSize, fileToBase64 } from "@/lib/utils";
import { MediaType, Post, ProcessingStatus, SavedItems } from "@/app/generated/prisma";
import { createClient } from "@/utils/supabase/client";

interface UploadImageProps {
    setUploadOpen: (open: boolean) => void;
    uploadOpen: boolean;
}

interface PostWithEmbeddings extends Post {
    embedding: number[];
}


// TODO: Move call to HF endpoint to the server side
// TODO: HF endpoint has cold starts when scaled to zero, returns 500 whilst warming up
// TODO: Consider setting min replica to 1 / disabling scale to zero

export const UploadImage = ({ setUploadOpen, uploadOpen }: UploadImageProps) => {
    const [status, setStatus] = useState("Ready");
    async function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        const file = ev.target.files?.[0];
        if (!file) return;

        setStatus("Preparing…");

        const imageData = await getImageSize(file);
        const base64 = await fileToBase64(file);

        const hfResponse = await fetch(process.env.NEXT_PUBLIC_HF_ENDPOINT!, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: {
                    text: "image",
                    image: base64,
                },
            }),
        })

        // If the HF endpoint returns an error, most likely to cold star
        if (!hfResponse.ok) {
            console.error(hfResponse);
            setStatus("Upload failed");
            return;
        }
        const { embeddings } = await hfResponse.json()

        // Ask the server action for a presigned POST
        const { url, fields, key } = await getS3UploadUrl({
            contentType: file.type,
            sizeBytes: file.size,
        });

        // Build a multipart / form - data POST directly to S3
        const form = new FormData();
        Object.entries(fields).forEach(([k, v]) => form.append(k, v as string));
        form.append("file", file);

        setStatus("Uploading to S3…");
        const res = await fetch(url, { method: "POST", body: form });

        if (!res.ok) {
            console.error(res);
            setStatus("Upload failed");
            return;
        }

        setStatus("Done!");

        const newPost: PostWithEmbeddings = {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            isAiGenerated: false,
            isNsfw: false,
            isPrivate: false,
            userId: user?.user?.id as string,
            mediaUrl: "https://pinit-images-bucket.s3.eu-west-1.amazonaws.com/" + key,
            mediaType: "image" as MediaType,
            mediaWidth: imageData.width,
            mediaHeight: imageData.height,
            mediaSize: imageData.size,
            mediaAspectRatio: imageData.aspectRatio,
            mediaAltText: "",
            embedding: embeddings,
            processingStatus: "not_started" as ProcessingStatus,
        };

        const { data, error } = await supabase.from("posts").insert(newPost).select("id").single();
        if (error) {
            console.error(error);
            setStatus("Upload failed");
            return;
        }

        const new_saved_post: SavedItems = {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            postId: data.id,
            userId: user?.user?.id as string,
        }
        await supabase.from("saved_items").insert(new_saved_post).select("id").single();

    }

    return (
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogContent className="bg-black text-white">
                <DialogTitle>Upload Image</DialogTitle>
                <p>{status}</p>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFile}
                />
            </DialogContent>
        </Dialog >
    );
};

