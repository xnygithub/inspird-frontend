"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getImageMeta, fileToBase64 } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createPost } from "@/lib/queries/posts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageMeta } from "@/lib/utils";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";


// TODO: Move call to HF endpoint to the server side
// TODO: HF endpoint has cold starts when scaled to zero, returns 500 whilst warming up
// TODO: Consider setting min replica to 1 / disabling scale to zero
// TODO: Move all this logic to server side

function createPostInput(imageData: ImageMeta, embedding: number[]) {
    return {
        mediaUrl: imageData.url,
        mediaWidth: imageData.width,
        mediaHeight: imageData.height,
        mediaSize: imageData.size,
        mediaAspectRatio: imageData.aspectRatio,
        mediaAltText: "",
        embedding: embedding,
    }
}

export const UploadImage = ({
    setUploadOpen,
    uploadOpen
}: {
    setUploadOpen: (open: boolean) => void;
    uploadOpen: boolean;
}
) => {
    const [status, setStatus] = useState("Ready");
    async function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {

        const file = ev.target.files?.[0];
        if (!file) return;

        const supabase = createClient();
        setStatus("Preparing…");

        const base64 = await fileToBase64(file);
        const hfResponse = await fetch(process.env.NEXT_PUBLIC_HF_ENDPOINT!, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: { image: base64 } }),
        })

        // If the HF endpoint returns an error, most likely to cold star
        if (!hfResponse.ok) {
            setStatus("Upload failed");
            return;
        }
        const { embedding } = await hfResponse.json()
        const imageData = await getImageMeta(file);
        const arrayBuf = await file.arrayBuffer();

        const { error: storageError } = await supabase.storage
            .from('i')
            .upload(imageData.url, arrayBuf, {
                contentType: file.type,
                cacheControl: '31536000',
                upsert: false
            });

        if (storageError) {
            setStatus("Upload failed");
            return;
        }

        const newPost = createPostInput(imageData, embedding);
        const { error } = await createPost(supabase, newPost);
        if (error) {
            console.error(error);
            setStatus("Upload failed");
            return;
        }
        setStatus("Done!");
    }

    return (
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogContent showCloseButton={false} className="bg-popover rounded-xl w-md max-w-md font-sans text-white">
                <DialogTitle hidden>Upload Image Form</DialogTitle>
                {/* <p>{status}</p> */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="font-semibold text-xl">Upload Image</h1>
                </div>
                <Label htmlFor="image" hidden>Upload Image</Label>
                <Input
                    hidden
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFile}
                />
                <Button
                    type="button"
                    className="mt-2"
                    onClick={() => document.getElementById('image')?.click()}>
                    <ImageIcon size={16} />
                    Choose Image
                </Button>
            </DialogContent>
        </Dialog >
    );
};

