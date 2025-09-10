"use server"
import { createClient } from "@/utils/supabase/server";

export async function getUserProfileByUsername(username: string) {
    const supabase = await createClient();
    // TODO: Filter out private posts from the count
    const currentUser = await supabase.auth.getUser();

    // Get core user data
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error) return null


    const { count: savedItemsCount, error: savedItemsError } = await supabase
        .from("saved_items")
        .select('*', { count: 'exact', head: true })
        .eq("userId", data.id)

    if (savedItemsError) throw new Error(savedItemsError.message);

    data.post_count = savedItemsCount;
    data.is_me = data.auth_sub === currentUser.data.user?.id;
    return data;
}

export async function getUsersPosts(userId: number, from: number, to: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("saved_items")
        .select(`*, 
            posts(media_url, media_type, media_width, media_height, media_size, media_aspect_ratio, media_alt_text, 
            users(username, avatar_url))`)
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .range(from, to);

    if (error) throw new Error(error.message);
    return data;
}
