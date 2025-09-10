"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "crypto";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

type GetUploadUrlInput = {
    contentType: string;  // e.g. "image/png"
    sizeBytes: number;    // from client, enforce your own limits
};

export async function getS3UploadUrl({ contentType, sizeBytes }: GetUploadUrlInput) {
    // Only allow image png and jpeg for now
    if (!/^image\/(png|jpeg)$/.test(contentType)) {
        throw new Error("Unsupported content type");
    }
    // Only allow file size up to 10MB
    if (sizeBytes > 10 * 1024 * 1024) {
        throw new Error("File too large");
    }

    const key = `${randomUUID()}`; // or include user/tenant prefix

    const { url, fields } = await createPresignedPost(s3, {
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Conditions: [
            ["content-length-range", 0, 10 * 1024 * 1024],
            ["starts-with", "$Content-Type", contentType.split("/")[0] === "image" ? "image/" : ""],
        ],
        Fields: {
            "Content-Type": contentType,
            "x-amz-server-side-encryption": "AES256",
        },
        Expires: 20,
    });

    return {
        url,          // S3 POST endpoint
        fields,       // form fields to include
        key,          // object key in S3
    };
}
