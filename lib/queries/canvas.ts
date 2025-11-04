import { slugify } from "@/utils/slufigy";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const createCanvasDoc = (
    client: SupabaseClient,
    canvasTitle: string
) => {
    return client
        .from("canvas_doc")
        .insert(
            {
                title: canvasTitle,
                slug: slugify(canvasTitle)
            })
};

export const deleteCanvasDoc = (
    client: SupabaseClient,
    canvasId: string
) => {
    return client
        .from("canvas_doc")
        .delete()
        .eq("id", canvasId)
};

export const getCanvasDoc = (
    client: SupabaseClient<Database>,
    username: string,
    canvasTitle: string
) => {
    return client
        .from("canvas_doc")
        .select(`
            id, title, data, isPrivate,
            owner:profiles!inner(username,id)`)
        .eq("owner.username", username)
        .eq("title", canvasTitle)
        .single();
};

export const getUsersCanvasDocs = (
    client: SupabaseClient,
    userId: string
) => {
    return client
        .from("canvas_doc")
        .select("*, owner:profiles(username,id)")
        .eq("userId", userId)
}