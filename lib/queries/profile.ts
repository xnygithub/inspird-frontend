import { SupabaseClient } from "@supabase/supabase-js";

export const getUserSettings = (
    client: SupabaseClient,
    id: string
) => {
    return client
        .from("profiles")
        .select("id, username, email")
        .eq("id", id)
        .single();
}

export async function getUserProfile(
    client: SupabaseClient,
    username: string
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

    if (error) return null;
    let isMe = false;
    if (!currentUser.data.user) isMe = false;
    else isMe = data.id === currentUser.data.user?.id;
    return { ...data, isMe };
}