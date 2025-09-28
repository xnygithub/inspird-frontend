import { SupabaseClient } from "@supabase/supabase-js";

export const getUserProfileByUsername = (client: SupabaseClient, username: string) => {
    return client.from("profiles").select("*").eq("username", username).single();
}

export const getUserSettings = (client: SupabaseClient, id: string) => {
    return client.from("profiles")
        .select("id, username, email")
        .eq("id", id)
        .single();
}

export const getPostCounts = (client: SupabaseClient, userId: string) => {
    return client.from("saved_items").select("*", { count: "exact", head: true }).eq("userId", userId);
}

export const getUserId = (client: SupabaseClient, username: string) => {
    return client.from("profiles").select("id").eq("username", username).single();
}

export const getUser = (client: SupabaseClient, id: string) => {
    return client.from("profiles").select("*").eq("id", id).single();
}

export async function getUserProfile(
    client: SupabaseClient, username: string
) {
    const currentUser = await client.auth.getUser();
    const { data, error } = await client
        .from("profiles")
        .select(`
        id, username, email, displayName, avatarUrl, profilePrivate, createdAt,
        savedItemsCount:saved_items(count),
        foldersCount:folders(count),
        canvasDocCount:canvas_doc(count)
      `)
        .eq("username", username)
        .single();

    if (error) throw new Error("Failed to get user profile");
    let isMe = false;
    if (!currentUser.data.user) isMe = false;
    else isMe = data.id === currentUser.data.user?.id;
    return { ...data, isMe };
}