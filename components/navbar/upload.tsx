"use client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getS3UploadUrl } from "@/app/actions/s3";
import { getImageSize } from "@/lib/utils";
import { MediaType } from "@/app/generated/prisma";
import { createClient } from "@/utils/supabase/client";


export const UploadImage = () => {


    const [status, setStatus] = useState("Ready");
    async function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();

        const file = ev.target.files?.[0];
        if (!file) return;

        setStatus("Preparing…");

        const imageData = await getImageSize(file);

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
        // You now have the S3 object at `key`. Persist it server-side if needed.
        // Optionally show a preview (if the bucket is public/behind CF) or call a route to record metadata.
        console.log({ key });


        const new_post = {
            user_id: user?.user?.user_metadata?.id as number,
            media_url: "https://pinit-images-bucket.s3.eu-west-1.amazonaws.com/" + key,
            media_type: "image" as MediaType,
            media_width: imageData.width,
            media_height: imageData.height,
            media_size: imageData.size,
            media_aspect_ratio: imageData.aspectRatio,
            media_alt_text: "",
        };

        await supabase.from("posts").insert(new_post).single();
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button>Upload</Button>
            </DialogTrigger>
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

