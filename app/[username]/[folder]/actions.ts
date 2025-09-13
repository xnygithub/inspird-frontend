"use server"
import { createClient } from "@/utils/supabase/server";

export async function createFolder(formData: FormData) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null
    const id = user.data.user?.user_metadata?.id as number;


    const folderName = formData.get("folderName") as string;
    const { data, error } = await supabase
        .from("folders")
        .insert({ name: folderName, userId: id })
        .select("*")
        .single();

    if (error) return null

    return data;
}

export async function createSection(folderId: number, formData: FormData) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null

    const sectionName = formData.get("sectionName") as string;
    const { data, error } = await supabase
        .from("folder_sections")
        .insert({ name: sectionName, folderId: folderId })
        .select("*")
        .single();

    if (error) return null

    return data;
}
