import { Post, SavedItems } from "@/app/generated/prisma";
import { Database } from "@/database.types";

type FolderDetailsType = Database['public']['Functions']['get_folder_with_counts']['Returns'][number];
type MediaType = Database['public']['Enums']['MediaType'];

export interface FolderWithCounts extends Omit<FolderDetailsType, 'mediaCounts'> {
    mediaCounts: Record<MediaType, number>;
}

export type FolderSummary = Database['public']['Functions']['folders_summary']['Returns'][number];



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