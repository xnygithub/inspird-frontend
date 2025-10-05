import { MediaType, Post, SavedItems } from "@/app/generated/prisma";

export interface FolderCard {
    id: string
    slug: string
    name: string
    isPrivate: boolean
    lastUpdated: string
    ownerUsername: string
    postCount: number
    thumbnails: string[] | null
}

export interface FolderDetails {
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

export interface FolderDropdown {
    id: string,
    name: string,
    isPrivate: boolean,
    postCount: number,
    thumbnail: string,
    containsPost: boolean
}