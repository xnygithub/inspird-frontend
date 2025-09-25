import { createClient } from "@/utils/supabase/client";
import { Post, Profile, SavedItems } from "@/app/generated/prisma";
import { SupabaseClient } from "@supabase/supabase-js";

export interface GetUsersPostsResult extends SavedItems {
    posts: Post & { users: Profile };
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

export const getSimilarPosts = (client: SupabaseClient, postId: string) => {
    return client.rpc("match_posts_to_post", {
        post_id: postId,
        match_count: 10,
        min_similarity: 0.7
    });
}
export const deletePost = (client: SupabaseClient, postId: string) => {
    return client.from("posts").delete().eq("id", postId);
}

