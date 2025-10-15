import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";

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

export function getProfileRPC(
    client: SupabaseClient<Database>,
    p_username: string
) {
    return client.rpc("get_profile", { p_username }).maybeSingle();
}

export function updateAvatar(
    client: SupabaseClient<Database>,
    avatarUrl: string,
    userId: string
) {
    return client.from("profiles").update({ avatarUrl }).eq("id", userId);
}

export function uploadAvatar(
    client: SupabaseClient<Database>,
    avatarUrl: string,
    file: File
) {
    return client.storage
        .from("user-avatars")
        .update(avatarUrl, file, {
            contentType: file.type,
            upsert: true,
            cacheControl: "600"
        });
}