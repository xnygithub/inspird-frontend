import { SupabaseClient } from "@supabase/supabase-js";

export const getUsersPosts = (client: SupabaseClient, userId: string) => {
    return client
        .from("saved_items")
        .select(`*, posts!inner(*, users:profiles(username, avatarUrl))`)
        .eq("userId", userId)
        .eq("posts.processingStatus", "not_started")
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
