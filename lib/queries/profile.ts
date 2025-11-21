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


export function updateAvatar(
    client: SupabaseClient<Database>,
    avatarUrl: string,
    userId: string
) {
    return client.from("profiles").update({ avatarUrl }).eq("id", userId);
}

export function uploadStorage(
    client: SupabaseClient<Database>,
    bucket: string,
    key: string,
    file: File
) {
    return client.storage
        .from(bucket)
        .upload(key, file, {
            contentType: file.type,
            cacheControl: "600"
        });
}

export function removeStorage(
    client: SupabaseClient<Database>,
    bucket: string,
    key: string
) {
    return client.storage
        .from(bucket)
        .remove([key]);
}