import './post.css'
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import SidebarProvider from "@/app/(app)/posts/[id]/_components/sidebar.provider"
import ToggleSidebarButton from "@/app/(app)/posts/[id]/_components/toggle"
import Similar from "@/app/(app)/posts/[id]/_components/similar"
import { FolderSave } from '@/components/posts/popover-save'
import Edit from "@/app/(app)/posts/[id]/_components/edit"
import { getMediaUrl } from "@/utils/urls"
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/database.types'

interface Props {
    id: string
}

async function getPost(
    client: SupabaseClient<Database>,
    id: string
) {
    const { data, error } = await client
        .from('posts')
        .select('id, mediaUrl, mediaAltText, mediaWidth, mediaHeight')
        .eq('id', id)
        .single()
    if (error || !data) return null
    return data
}


export default async function PostPage({
    params
}: {
    params: Promise<Props>
}) {
    const { id } = await params
    const supabase = await createClient()
    const data = await getPost(supabase, id)
    if (!data) return notFound()

    return (
        <SidebarProvider>
            <div id="selected-post-container" className='padding-top relative mt-20'>
                <Image
                    src={getMediaUrl(data.mediaUrl)}
                    alt={data.mediaAltText}
                    width={data.mediaWidth}
                    height={data.mediaHeight}
                    className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                />
                <div className="top-4 right-4 absolute flex space-x-2">
                    <FolderSave postId={data.id} />
                    <Edit postId={data.id} urlPath={data.mediaUrl} />
                    <ToggleSidebarButton />
                </div>
            </div>
            <Similar postId={data.id} />
        </SidebarProvider>
    )
}   