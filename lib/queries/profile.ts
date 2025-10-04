import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createClient } from "@/utils/supabase/client";

export async function getProfileRaw(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
}

// a tiny factory so we can have dynamic keys/tags
export function getProfileCached(userId: string) {
    const tag = `profile:${userId}`;
    return unstable_cache(
        async () => getProfileRaw(userId),
        [tag],                          // cache key
        { tags: [tag] }                 // make it tag-invalidatable
    )();
}

export const getUserSettings = (
    client: SupabaseClient,
    id: string
) => {
    return client
        .from("profiles")
        .select("id, username, displayName, email, profilePrivate, avatarUrl")
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
        id, username, email, displayName, avatarUrl, profilePrivate, createdAt, isPro:subscriptionStatus,
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