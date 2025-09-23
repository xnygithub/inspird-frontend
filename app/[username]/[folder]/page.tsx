import './folder.css'
import { NavigationBar } from "@/app/[username]/[folder]/components/navbar"
import { FolderDetails } from "@/app/[username]/[folder]/components/details"
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import FolderPosts from './components/posts'

interface UserFolderPageProps {
    params: {
        username: string
        folder: string
    }
}

async function getFolder(folder_name: string, username: string) {
    const supabase = await createClient();
    const { data: targetUser, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();
    if (userError) return notFound();

    const { data: folder, error } = await supabase
        .from("folders")
        .select("*")
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
        <FolderPosts folderId={folder.id} userId={folder.userId} />
    </>
}   