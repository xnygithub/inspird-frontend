import { SupabaseClient } from "@supabase/supabase-js";

export const deletePostFromFolder =
    (client: SupabaseClient, userId: string, folderId: string, postId: string) => {
        return client
            .from("folder_posts")
            .delete()
            .eq("userId", userId)
            .eq("folderId", folderId)
            .eq("postId", postId);
    }

export const savePostToFolder = (client: SupabaseClient, userId: string, folderId: string, postId: string) => {
    return client.from("folder_posts").insert({ userId, folderId, postId });
}

export const getFolder = (client: SupabaseClient, userId: string, slug: string) => {
    return client.from("folders").select("*").eq("userId", userId).eq("slug", slug).single();
}

export const folderMediaCount = (client: SupabaseClient, userId: string, slug: string) => {
    return client.rpc('folder_media_counts', {
        p_user: userId,
        p_slug: slug,
    });
}

export const getFolderPosts =
    (client: SupabaseClient, userId: string, folderId: string) => {
        return client
            .from('folder_posts')
            .select('*, posts (*, profiles (username))')
            .eq('userId', userId)
            .eq('folderId', folderId)
    }

export const getFolderList = (client: SupabaseClient, userId: string) => {
    return client
        .from("folders")
        .select("*, folder_posts(count)")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
}

export const getFolderListForPostId = (
    client: SupabaseClient,
    userId: string,
    postId: string
) => {
    return client
        .from("folders")
        .select(`
        *,
        total_posts:folder_posts(count),
        is_saved:folder_posts!left(count)
      `)
        .eq("userId", userId)
        // filter only the is_saved relation
        .eq("is_saved.postId", postId)
        .order("createdAt", { ascending: false });
};