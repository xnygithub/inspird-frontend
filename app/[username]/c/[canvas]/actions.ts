"use server"
import { createClient } from "@/utils/supabase/server";

export async function createCanvas(formData: FormData) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        throw new Error("User not found")
    }
    const id = user.data.user.id


    const canvasTitle = formData.get("canvasTitle") as string;
    const initialData = { schemaVersion: 1, stage: { zoom: 1, x: 0, y: 0 }, images: [] };
    const { data, error } = await supabase
        .from("canvas_doc")
        .insert({ id: crypto.randomUUID(), title: canvasTitle, userId: id, data: initialData })
        .select("*")
        .single();
    console.log("data", data)
    console.log("error", error)

    if (error) return null

    return data;
}

export async function getCanvas(canvasId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("canvas_doc")
        .select("*")
        .eq("id", canvasId)
        .single();

    if (error) return null

    return data;
}