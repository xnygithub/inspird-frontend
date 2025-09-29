"use server"
import { createClient } from "@/utils/supabase/server";
import { CanvasData } from "@/app/[username]/c/[canvas]/types";
import { createCanvasDoc } from "@/lib/queries/canvas";

export async function createCanvas(formData: FormData) {
    const supabase = await createClient();
    const canvasTitle = formData.get("canvasTitle") as string;
    const { data, error } = await createCanvasDoc(supabase, canvasTitle)
    if (error) throw new Error(error.message)
    return data;
}

export async function updateCanvas(canvasId: string, canvasData: CanvasData) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("canvas_doc")
        .update({ data: canvasData })
        .eq("id", canvasId)
        .select("*")
        .single();

    if (error) return null

    return data;
}