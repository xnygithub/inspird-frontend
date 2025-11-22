"use server"
import { slugify } from "@/utils/slufigy";
import { EditAccountInput, editAccountInputSchema } from "@/lib/zod/settings.schema";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";


export async function updateAccount(data: EditAccountInput) {
    const parsed = editAccountInputSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid input");
    const supabase = await createClient();
    const currentUser = await supabase.auth.getUser();

    if (!currentUser.data.user) throw new Error("User not found")

    const { username, displayName, profilePrivate } = parsed.data;

    const { error } = await supabase
        .from("profiles")
        .update({
            username: slugify(username),
            displayName: displayName,
            profilePrivate: profilePrivate
        })
        .eq("id", currentUser.data.user.id)

    if (error) throw new Error(error.message)
    revalidateTag(`profile:${currentUser.data.user.id}`);
    redirect(`/${username}`);
}