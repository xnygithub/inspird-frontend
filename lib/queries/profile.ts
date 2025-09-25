import { SupabaseClient } from "@supabase/supabase-js";

export const getUserId = (client: SupabaseClient, username: string) => {
    return client.from("profiles").select("id").eq("username", username).single();
}

export const getUser = (client: SupabaseClient, id: string) => {
    return client.from("profiles").select("*").eq("id", id).single();
}