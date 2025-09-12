import './post.css'
import SidebarProvider from "@/app/posts/[id]/_components/sidebar"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = createClient()
    const { data } = await supabase.from('posts').select('*').eq('id', id).single()
    if (!data) return notFound()
    return (
        <SidebarProvider>
            <div id="post-container" >
                <div id="selected-post-container" >
                    <Image
                        alt="Post"
                        src={data.media_url}
                        width={data.media_width}
                        height={data.media_height}
                        className="z-[-10] object-cover"
                    />
                </div>
                <div id="similar-posts-container">
                    <p className="text-white">{data.media_url}</p>
                </div>
            </div>
        </SidebarProvider>
    )
}   