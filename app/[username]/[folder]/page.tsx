import './folder.css'
import { NavigationBar } from "@/app/[username]/[folder]/_components/navigation-bar"
import { FolderDetails } from "@/app/[username]/[folder]/_components/folder-details"
import { Sections } from "@/app/[username]/[folder]/_components/sections"
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import FolderPosts from './_components/folder-posts'

interface UserFolderPageProps {
    params: {
        username: string
        folder: string
    }
}

async function getFolder(folder_name: string, username: string) {
    const supabase = await createClient();
    const { data: targetUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();
    if (userError) return notFound();

    const { data: folder, error } = await supabase
        .from("folders")
        .select("* , folder_sections(*)")
        .eq("name", folder_name)
        .eq("userId", targetUser.id)
        .single();
    if (error) return notFound();

    const { count, error: fError } = await supabase
        .from('folder_posts')
        .select('id', { count: 'exact', head: true })
        .eq("folderId", folder.id)



    folder.folderPostCount = fError ? 0 : count;
    return folder;
}


export default async function UserFolderPage({ params }: UserFolderPageProps) {
    const { folder: folder_name, username } = await params
    const folder = await getFolder(folder_name, username);
    return <>
        <NavigationBar />
        <FolderDetails folder={folder} />
        <Sections folder={folder} />
        <FolderPosts folderId={folder.id} userId={folder.userId} />
        {/* <pre>{JSON.stringify(folder, null, 2)}</pre> */}
    </>
}   