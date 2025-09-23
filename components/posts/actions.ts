"use server"
import { createClient } from "@/utils/supabase/server";
import { SavedItems } from "@/app/generated/prisma";

export async function quicksavePost(postId: string) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from("saved_items")
        .insert({ userId: user.data.user.id, postId: postId })
        .select("id")
        .single();
    if (error) throw new Error("Failed to create save item")
    return data as SavedItems;
}

export async function savePostToFolder(
    folderId: string,
    postId: string,
) {
    // To save a post to a folder, the user first needs to create a save item
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return { error: "Unauthorized" }

    if (!folderId || !postId) throw new Error("Folder ID and post ID are required")

    const { data, error } = await supabase
        .from("saved_items")
        .upsert(
            { userId: user.data.user.id, postId: postId },
            { onConflict: "userId,postId" })
        .select("id")
        .single();
    if (error) throw new Error("Failed to create save item")

    const { data: folderPost, error: folderPostError } = await supabase
        .from("folder_posts")
        .insert({
            userId: user.data.user.id,
            folderId: folderId,
            postId: postId,
            savedItemsId: data.id,
        })
        .select("*")
        .single();

    if (folderPostError) throw new Error("Failed to save post to folder: " + folderPostError.message)

    return folderPost;
}