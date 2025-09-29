"use server";
import { createClient } from "@/utils/supabase/server";
import { EditFolderInput, editFolderSchema } from "@/lib/zod/folder.schema";
import { slugify } from "@/utils/slufigy";

export async function editFolder(id: string, data: EditFolderInput) {
    const parsed = editFolderSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid input");

    const { name, description, isPrivate } = parsed.data;
    const supabase = await createClient()
    const { error } = await supabase
        .from("folders")
        .update({ name, slug: slugify(name), description, isPrivate })
        .eq("id", id);

    if (error) throw new Error("Failed to update folder");

    return { newSlug: slugify(name) };
}
