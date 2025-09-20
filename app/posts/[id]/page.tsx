import './post.css'
import Image from "next/image"
import { notFound } from "next/navigation"
import { Post } from '@/app/generated/prisma'
import { createClient } from "@/utils/supabase/client"
import SidebarProvider from "@/app/posts/[id]/components/sidebar"
import Similar from "@/app/posts/[id]/components/similar"

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
            <div id="post-container" >
                <div id="selected-post-container" >
                    <Image
                        className="object-cover"
                        alt={data.mediaAltText}
                        src={data.mediaUrl}
                        width={data.mediaWidth}
                        height={data.mediaHeight}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
                <div id="similar-posts-container">
                    <Similar data={data} />
                </div>
            </div>
        </SidebarProvider>
    )
}   