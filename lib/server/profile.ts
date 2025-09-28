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

export async function getUserProfile(username: string) {
    const supabase = await createClient();
    const currentUser = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("profiles")
        .select(`
        id, username, email, displayName, avatarUrl, profilePrivate, createdAt,
        saved_items:saved_items(count),
        folders:folders(count),
        canvas_doc:canvas_doc(count)
      `)
        .eq("username", username)
        .single();

    if (error || !data) return null;

    // The aggregates come back as 1-element arrays: [{ count: number }]
    const savedItemsCount = data.saved_items?.[0]?.count ?? 0;
    const foldersCount = data.folders?.[0]?.count ?? 0;
    const canvasDocsCount = data.canvas_doc?.[0]?.count ?? 0;

    return {
        ...data,
        savedItemsCount,
        foldersCount,
        canvasDocCount: canvasDocsCount,
        isMe: data.id === currentUser.data.user?.id,
    };
}