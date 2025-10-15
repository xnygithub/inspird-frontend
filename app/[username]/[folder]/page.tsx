import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import FolderPosts from '@/app/[username]/[folder]/components/posts'
import { FolderDetails } from "@/app/[username]/[folder]/components/details"
import { FolderWithCounts } from '@/types/folders'

export default async function FolderPage(
    { params }: { params: Promise<{ username: string, folder: string }> }
) {
    const supabase = await createClient();
    const { folder, username } = await params;
    const { data, error } = await
        supabase.rpc('get_folder_with_counts',
            { f_slug: folder, p_username: username }
        ).maybeSingle();

    if (!data || error) notFound();
    const items = data as FolderWithCounts;
    const { data: { user } } = await supabase.auth.getUser();
    const canEdit = !!user && user.id === items.ownerUserId;

    return (
        <div className='padding-top mx-4'>
            <FolderDetails folder={items} canEdit={canEdit} />
            <FolderPosts folder={items} />
        </div>
    )
}   