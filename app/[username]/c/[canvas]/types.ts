import { Post, SavedItems } from "@/app/generated/prisma";

export type ImgItem = {
    id: string;
    src: string;
    postId: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    width: number;
    height: number;
};

export interface CanvasData {
    schemaVersion: number;
    stage: {
        zoom: number;
        x: number;
        y: number;
    };
    images: ImgItem[];
}

export interface AddPostProps extends SavedItems {
    post: Post;
}