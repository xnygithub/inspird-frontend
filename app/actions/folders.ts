"use server"
import { createClient } from "@/utils/supabase/server";
import { slugify } from "@/utils/slufigy";
import { createFolderSchema, type CreateFolderInput } from "@/lib/zod/folder.schema";

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