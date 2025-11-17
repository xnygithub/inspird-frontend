import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import FolderPosts from '@/app/(app)/[username]/[folder]/components/posts'
import { FolderDetails } from "@/app/(app)/[username]/[folder]/components/details"
import Sections from './components/sections'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/database.types'
import { FolderWithCounts } from '@/types/folders'

async function getFolder(
    supabase: SupabaseClient<Database>,
    folder: string,
    username: string
) {
    const { data, error } = await supabase
        .rpc('get_folder_with_counts', {
            f_slug: folder,
            p_username: username
        }).single();

    if (error || !data) notFound();
    return data as FolderWithCounts;
}

export default async function FolderPage(
    { params }: { params: Promise<{ username: string, folder: string }> }
) {
    const supabase = await createClient();
    const { folder, username } = await params;
    const data = await getFolder(supabase, folder, username);


    const { data: { user } } = await supabase.auth.getUser();
    const canEdit = !!user && user.id === data.ownerUserId;

    return (
        <div className='space-y-8 px-4 md:px-6 pt-12 md:pt-24 transition-all duration-100'>
            <FolderDetails folder={data} canEdit={canEdit} />
            <Sections />
            <FolderPosts folder={data} />
        </div>
    )
}   