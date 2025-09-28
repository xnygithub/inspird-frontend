"use server"
import { createClient } from "@/utils/supabase/server";

export async function quicksavePost(postId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("saved_items").insert({ postId: postId })
    if (error) throw new Error("Failed to create save item")
    return { success: true }
}

export async function savePostToFolder(
    folderId: string,
    postId: string,
) {
    // To save a post to a folder, the user first needs to create a save item
    const supabase = await createClient();

    if (!folderId || !postId) throw new Error("Folder ID and post ID are required")

    const { data, error } = await supabase
        .from("saved_items")
        .upsert({ postId: postId }, { onConflict: "userId,postId" })
        .select("id")
        .single();
    if (error) throw new Error("Failed to create save item")

    const { data: folderPost, error: folderPostError } = await supabase
        .from("folder_posts")
        .insert({
            folderId: folderId,
            postId: postId,
            savedItemsId: data.id,
        })
        .select("*")
        .single();

    if (folderPostError) throw new Error("Failed to save post to folder: " + folderPostError.message)

    return folderPost;
}