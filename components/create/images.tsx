"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getImageSize, fileToBase64 } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createPost, createSavedPost } from "@/lib/queries/posts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadImageProps {
    setUploadOpen: (open: boolean) => void;
    uploadOpen: boolean;
}


// TODO: Move call to HF endpoint to the server side
// TODO: HF endpoint has cold starts when scaled to zero, returns 500 whilst warming up
// TODO: Consider setting min replica to 1 / disabling scale to zero
// TODO: Move all this logic to server side

export const UploadImage = ({ setUploadOpen, uploadOpen }: UploadImageProps) => {
    const [status, setStatus] = useState("Ready");
    async function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
        const supabase = createClient();

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

        const ext = file.name.split('.').pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const arrayBuf = await file.arrayBuffer();

        const { error: storageError }
            = await supabase.storage
                .from('i')
                .upload(path, arrayBuf, {
                    contentType: file.type,
                    cacheControl: '31536000',
                    upsert: false,
                });

        if (storageError) {
            console.error(storageError);
            setStatus("Upload failed");
            return;
        }
        setStatus("Done!");

        const newPost = {
            mediaUrl: path,
            mediaWidth: imageData.width,
            mediaHeight: imageData.height,
            mediaSize: imageData.size,
            mediaAspectRatio: imageData.aspectRatio,
            mediaAltText: "",
            embedding: embeddings,
        };

        const { data, error } = await createPost(supabase, newPost);
        if (error) {
            console.error(error);
            setStatus("Upload failed");
            return;
        }
        await createSavedPost(supabase, data.id);
    }

    return (
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogContent >
                <DialogTitle>Upload Image</DialogTitle>
                <p>{status}</p>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                    hidden
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFile}
                />
            </DialogContent>
        </Dialog >
    );
};

