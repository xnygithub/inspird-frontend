"use client";
import { createClient } from "@/utils/supabase/client";

export async function getUsersCanvasDocs(userId: string, from: number, to: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("canvas_doc")
        .select("*")
        .eq("userId", userId)
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}