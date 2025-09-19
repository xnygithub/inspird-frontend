"use client";
import { createClient } from "@/utils/supabase/client";
import { Post, SavedItems } from "@/app/generated/prisma";

export interface GetUsersPostsResult extends SavedItems {
    posts: Post;
}
export async function getUsersPosts(userId: string, from: number, to: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("saved_items")
        .select(`*, posts!inner(*, users:profiles(username, avatarUrl))`)
        .eq("userId", userId)
        .eq("posts.processingStatus", "not_started")
        .order("createdAt", { ascending: false })
        .range(from, to);

    if (error) throw new Error(error.message);
    return data as GetUsersPostsResult[];
}

