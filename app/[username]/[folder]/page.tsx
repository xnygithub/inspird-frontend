import './folder.css'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import FolderPosts from '@/app/[username]/[folder]/components/posts'
import { FolderDetails } from "@/app/[username]/[folder]/components/details"

export default async function FolderPage(
    { params }: { params: Promise<{ username: string, folder: string }> }
) {
    const supabase = await createClient();
    const { folder, username } = await params;
    const { data, error } = await supabase.rpc('get_folder_with_counts',
        { f_slug: folder, p_username: username }
    );

    if (!data || error) notFound();

    const { data: { user } } = await supabase.auth.getUser();
    const canEdit = !!user && user.id === data.owner.userId;

    return (
        <div id="folder-page">
            <FolderDetails folder={data} canEdit={canEdit} />
            <FolderPosts folder={data} />
        </div>
    )
}   