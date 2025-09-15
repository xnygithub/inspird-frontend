"use client";
import { createClient } from "@/utils/supabase/client";

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