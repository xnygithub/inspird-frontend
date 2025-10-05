import { SupabaseClient } from "@supabase/supabase-js";

export const deleteFolder = (
    client: SupabaseClient,
    folderId: string
) => {
    return client
        .from("folders")
        .delete()
        .eq("id", folderId);
}

export const deletePostFromFolder = (
    client: SupabaseClient,
    folderId: string,
    postId: string
) => {
    return client
        .from("folder_posts")
        .delete()
        .eq("folderId", folderId)
        .eq("postId", postId);
}

export const savePostToFolder = (
    client: SupabaseClient,
    savedItemsId: string,
    folderId: string,
    postId: string
) => {
    return client
        .from("folder_posts")
        .insert({ savedItemsId, folderId, postId });
}


export const getUsersFolders = (
    client: SupabaseClient,
    userId: string
) =>
    client.rpc("folders_summary", { user_id: userId });


export const getFolderPosts = (
    client: SupabaseClient,
    folderId: string
) => {
    return client
        .from('folder_posts')
        .select('*, posts (*, profiles (username))')
        .eq('folderId', folderId)
}

export const getFolderDropdown = (
    client: SupabaseClient,
    postId: string
) => {
    return client.rpc('folder_dropdown', { post_id: postId });
}
