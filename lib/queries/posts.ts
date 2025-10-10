import { SupabaseClient } from "@supabase/supabase-js";

interface CreatePostProps {
    mediaUrl: string;
    mediaWidth: number
    mediaHeight: number
    mediaSize: number
    mediaAspectRatio: number
    mediaAltText: string
    embedding: number[]
}

export const createPost = (
    client: SupabaseClient,
    post: CreatePostProps
) => {
    return client.from("posts").insert(post);
}

export const quickSavePost = (
    client: SupabaseClient,
    postId: string
) => {
    return client
        .from("saved_items")
        .upsert({ postId: postId }, { onConflict: "userId,postId" })
        .select("id")
        .single();
}

export const getUsersPosts = (
    client: SupabaseClient,
    userId: string
) => {
    return client
        .from("saved_items")
        .select(`*, posts!inner(*, users:profiles(username, avatarUrl))`)
        .eq("userId", userId)
        .eq("posts.processingStatus", "not_started")
}

export const getSimilarPosts = (
    client: SupabaseClient,
    postId: string
) => {
    return client.rpc("match_posts_to_post", {
        post_id: postId,
        match_count: 10,
        min_similarity: 0.7
    });
}

export const deletePost = (
    client: SupabaseClient,
    postId: string
) => {
    return client.from("posts").delete().eq("id", postId);
}

export const deletePostFromStorage = (
    client: SupabaseClient,
    key: string
) => {
    return client.storage.from("i").remove([key]);
}
