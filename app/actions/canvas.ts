"use server"
import { createClient } from "@/utils/supabase/server";
import { createCanvasDoc } from "@/lib/queries/canvas";

export async function createCanvas(formData: FormData) {
    const supabase = await createClient();
    const canvasTitle = formData.get("canvasTitle") as string;
    const { error } = await createCanvasDoc(supabase, canvasTitle)
    if (error) throw new Error(error.message)
}

export async function updateCanvas(
    canvasId: string,
    canvasData: string
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("canvas_doc")
        .update({ data: canvasData })
        .eq("id", canvasId)
        .select("id")

    if (error) return null

    return data;
}