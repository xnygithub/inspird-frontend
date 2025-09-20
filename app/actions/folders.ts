"use server"
import { createClient } from "@/utils/supabase/server";

export async function createFolder(formData: FormData) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return { error: "Unauthorized" }

    const folderName = formData.get("folderName") as string;
    const { data, error } = await supabase
        .from("folders")
        .insert({ name: folderName, userId: user.data.user.id })
        .select("*")
        .single();

    if (error) return { error: "Failed to create folder" }

    return data;
}

export async function createSection(folderId: string, formData: FormData) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return { error: "Unauthorized" }

    const sectionName = formData.get("sectionName") as string;
    const { data, error } = await supabase
        .from("folder_sections")
        .insert({ name: sectionName, folderId: folderId })
        .select("*")
        .single();

    if (error) return { error: "Failed to create section" }
    return data;
}
