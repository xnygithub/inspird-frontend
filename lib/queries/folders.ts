import { FolderWithCounts } from "@/types/folders";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";


export async function getFolderWithCounts(
    client: SupabaseClient,
    f_slug: string,
    p_username: string
): Promise<FolderWithCounts> {
    const { data, error } = await client.rpc(
        'get_folder_with_counts',
        { f_slug, p_username }
    );

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Folder not found');

    return data[0] as FolderWithCounts;
}


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
    client: SupabaseClient<Database>,
    userId: string
) => {
    return client.rpc("folders_summary", { user_id: userId }).select("*");
}

export const getFolderDropdown = (
    client: SupabaseClient,
    postId: string
) => {
    return client.rpc('folder_dropdown', { post_id: postId });
}
