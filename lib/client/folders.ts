"use client";
import { Folder } from "@/app/generated/prisma";
import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

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

export type FolderDropdown = Folder & {
    folder_posts: {
        count: number;
    }[];
}

export async function getFolderDropdown(userId: string, from: number, to: number) {
    console.log("Getting folder dropdown for user: " + userId);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("folders")
        .select("*, folder_sections(*), folder_posts(count)")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .range(from, to);

    if (error) throw new Error(error.message);
    return data as FolderDropdown[];
}

export const getFolderList = (client: SupabaseClient, userId: string) => {
    return client
        .from("folders")
        .select("*, folder_posts(count)")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });
}
