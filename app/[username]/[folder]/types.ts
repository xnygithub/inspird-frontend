import { Folder, MediaType, Post, SavedItems } from "@/app/generated/prisma";

export interface FolderDetails extends Folder {
    mediaCount: {
        media_type: MediaType;
        count: number;
    }[];
}

export interface FolderPosts {
    id: string
    folderId: string
    userId: string
    posts: Post & { profiles: { username: string } }
    saved_items: SavedItems
    createdAt: string
}