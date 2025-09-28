import { Folder } from "@/app/generated/prisma";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getUsersFolders = async (
    client: SupabaseClient,
    userId: string,
    from: number,
    to: number
) => {
    const { data, error } = await client
        .from("folders")
        .select(`*, 
            owner:profiles (username), 
            folder_posts (count)`)
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        // .order("createdAt", { foreignTable: "folder_posts", ascending: true })
        // .limit(1, { foreignTable: "folder_posts" })
        .range(from, to);

    if (error) throw error;

    // Flatten: pull the first post's mediaUrl into a single field
    return (data ?? []).map((f) => ({
        id: f.id,
        userId: f.userId,
        name: f.name,
        slug: f.slug,
        thumbnail:
            f.thumbnail ? f.thumbnail
                : f.folder_posts?.[0]?.posts?.mediaUrl ?
                    f.folder_posts?.[0]?.posts?.mediaUrl
                    : null,
        description: f.description,
        isPrivate: f.isPrivate,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        owner: f.owner,
        folder_posts: f.folder_posts,
    }));
};


export type FolderDropdown = Folder & {
    folder_posts: { count: number }[];
}


