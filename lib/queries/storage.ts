import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const uploadStorage = async (
    client: SupabaseClient<Database>,
    bucket: string,
    key: string,
    file: File
) => {
    const { error } = await client.storage
        .from(bucket)
        .upload(key, file, {
            contentType: file.type,
            cacheControl: "600",
        });
    return error
}