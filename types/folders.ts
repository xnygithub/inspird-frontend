import { MediaType, Post, SavedItems } from "@/app/generated/prisma";

export type FolderCard = {
    id: string
    slug: string
    name: string
    isPrivate: boolean
    lastUpdated: string
    ownerUsername: string
    postCount: number
    thumbnails: string[] | null
}

export type FolderDetails = {
    id: string;
    owner: {
        username: string;
        userId: string;
    };
    name: string;
    slug: string;
    description: string | null;
    isPrivate: boolean;
    createdAt: string;
    lastUpdated: string;
    mediaCounts: Record<MediaType, number>;
};


export interface FolderPosts {
    id: string
    folderId: string
    userId: string
    posts: Post & { profiles: { username: string } }
    saved_items: SavedItems
    createdAt: string
}