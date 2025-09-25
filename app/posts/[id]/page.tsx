import './post.css'
import Image from "next/image"
import { notFound } from "next/navigation"
import { Post } from '@/app/generated/prisma'
import { createClient } from "@/utils/supabase/client"
import SidebarProvider from "@/app/posts/[id]/_components/sidebar.provider"
import ToggleSidebarButton from "@/app/posts/[id]/_components/toggle"
import Similar from "@/app/posts/[id]/_components/similar"
import { SaveLabel } from '@/components/posts/save'
import Edit from "@/app/posts/[id]/_components/edit"

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

export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const data = await getPost(id)
    if (!data) return notFound()
    return (
        <SidebarProvider>
            <div id="selected-post-container" >
                <Image
                    src={data.mediaUrl}
                    alt={data.mediaAltText}
                    width={data.mediaWidth}
                    height={data.mediaHeight}
                    className="object-contain"
                    style={{ width: '100%', height: 'auto', maxHeight: '600px' }}
                />
                <div className="top-4 right-4 absolute flex space-x-2">
                    <SaveLabel postId={data.id} />
                    <Edit postId={data.id} />
                    <ToggleSidebarButton />
                </div>
            </div>
            <Similar postId={data.id} />
        </SidebarProvider>
    )
}   