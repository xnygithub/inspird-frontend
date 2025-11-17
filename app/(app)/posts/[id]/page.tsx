import './post.css'
import Image from "next/image"
import { notFound } from "next/navigation"
import { Post } from '@/app/generated/prisma'
import { createClient } from "@/utils/supabase/client"
import SidebarProvider from "@/app/(app)/posts/[id]/_components/sidebar.provider"
import ToggleSidebarButton from "@/app/(app)/posts/[id]/_components/toggle"
import Similar from "@/app/(app)/posts/[id]/_components/similar"
import { FolderSave } from '@/components/posts/save'
import Edit from "@/app/(app)/posts/[id]/_components/edit"
import { getMediaUrl } from "@/utils/urls"

async function getPost(id: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single() as { data: Post }
    if (!data) return notFound()
    return data
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getPost(id)
    if (!data) return notFound()
    return (
        <SidebarProvider>
            <div id="selected-post-container" >
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