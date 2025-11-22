import { Post, SavedItems } from "@/app/generated/prisma";
import { GroupItem, TextItem } from "@/app/(app)/[username]/canvas/[canvas]/types";

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
    parentId?: string | null;
};


export type CanvasData = {
    schemaVersion: number;
    stage: {
        zoom: number;
        x: number;
        y: number;
    };
    images: ImgItem[];
    groups: GroupItem[];
    texts: TextItem[];
}

export interface CanvasType {
    id: string;
    title: string;
    data: CanvasData;
    isPrivate: boolean;
    owner: {
        id: string;
        username: string;
    };
}

export interface AddPostProps extends SavedItems {
    post: Post;
}