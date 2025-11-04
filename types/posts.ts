export interface SimilarPost {
    id: string
    mediaUrl: string
    mediaWidth: number
    mediaHeight: number
    mediaAltText: string
    ownerUsername: string
    ownerId: string
}

import { Database } from "@/database.types";

export type ProfilePostsType = Database['public']['Functions']['get_posts']['Returns'][number];