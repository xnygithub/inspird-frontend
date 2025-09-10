"use server"
import { createClient } from "@/utils/supabase/server";

export async function getUsersPosts(userId: number, from: number, to: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("posts")
        .select("*, users(username, avatar_url)")
        .eq("user_id", userId)
        .order("createdAt", { ascending: false })
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}
