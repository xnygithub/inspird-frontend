import "server-only";
import { createClient } from "@/utils/supabase/server";

export async function getUserProfileByUsername(username: string) {
    const supabase = await createClient();
    // TODO: Filter out private posts from the count
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

    if (error) return null

    const { count: savedItemsCount, error: savedItemsError } = await supabase
        .from("saved_items")
        .select('*', { count: 'exact', head: true })
        .eq("userId", data.id)

    if (savedItemsError) throw new Error(savedItemsError.message);

    const { count: foldersCount, error: foldersError } = await supabase
        .from("folders")
        .select('*', { count: 'exact', head: true })
        .eq("userId", data.id)

    if (foldersError) throw new Error(foldersError.message);

    const { count: canvasDocsCount, error: canvasDocsError } = await supabase
        .from("canvas_doc")
        .select('*', { count: 'exact', head: true })
        .eq("userId", data.id)

    if (canvasDocsError) throw new Error(canvasDocsError.message);


    data.postCount = savedItemsCount;
    data.folderCount = foldersCount;
    data.canvasDocCount = canvasDocsCount;
    data.isMe = data.id === currentUser.data.user?.id;
    return data;
}