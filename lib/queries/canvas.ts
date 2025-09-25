import { SupabaseClient } from "@supabase/supabase-js";

export const getUsersCanvasDocs = (client: SupabaseClient, userId: string) => {
    return client.from("canvas_doc").select("*").eq("userId", userId)
}