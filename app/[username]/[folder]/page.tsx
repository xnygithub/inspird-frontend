import './folder.css'
import { NavigationBar } from "@/app/[username]/[folder]/components/navbar"
import { FolderDetails } from "@/app/[username]/[folder]/components/details"
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import FolderPosts from '@/app/[username]/[folder]/components/posts'
import { folderMediaCount, getFolder } from '@/lib/queries/folders'
import { getUserId } from '@/lib/queries/profile'


export default async function UserFolderPage(
    { params }: { params: { username: string, folder: string } }
) {
    const supabase = await createClient();
    const { folder: folderName, username } = await params

    // Get user id
    const { data: targetUser, error: userError } = await getUserId(supabase, username);
    if (userError) return notFound();

    // Get folder
    const { data: folder, error } = await getFolder(supabase, targetUser.id, folderName);
    if (error) return notFound();
    if (folder.isPrivate && folder.userId !== targetUser.id) return notFound();

    // Get media counts
    const { data: mediaCounts } = await folderMediaCount(supabase, targetUser.id, folderName);
    folder.mediaCount = mediaCounts;

    return (
        <div id="folder-page">
            <NavigationBar username={username} folder={folderName} />
            <FolderDetails folder={folder} />
            <FolderPosts folder={folder} />
        </div>)
}   