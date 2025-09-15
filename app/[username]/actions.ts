"use server"
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

    data.postCount = savedItemsCount;
    data.folderCount = foldersCount;
    data.isMe = data.id === currentUser.data.user?.id;
    return data;
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
    return data;
}

export async function getUsersFolders(userId: string, from: number, to: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}