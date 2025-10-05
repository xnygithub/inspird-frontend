"use server"
import { createClient } from "@/utils/supabase/server";
import { slugify } from "@/utils/slufigy";
import {
    CreateFolderInput,
    createFolderSchema,
    EditFolderInput,
    editFolderSchema
} from "@/lib/zod/folder.schema";

export async function createFolder(input: CreateFolderInput) {
    const parsed = createFolderSchema.safeParse(input);
    if (!parsed.success) throw new Error("Invalid input");
    const supabase = await createClient();

    const { name } = parsed.data;
    const { error } = await supabase
        .from("folders")
        .insert({ name: name, slug: slugify(name) })

    if (error) throw new Error(error.message)
    return { newSlug: slugify(name) };
}



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

