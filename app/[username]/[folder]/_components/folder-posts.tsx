"use client"
import { FolderPost, Post, SavedPost } from '@/app/generated/prisma'
import '@/app/[username]/[folder]/folder.css'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"


async function getFolderPosts(folderId: number, userId: number, from: number, to: number) {
    const supabase = await createClient();
    console.log('folderId', folderId)
    const { data, error } = await supabase
        .from('folder_posts')
        .select(
            `*,
            posts (*),
            saved_items (*)
            `)
        .eq('userId', userId)       // folder_posts.userId
        .eq('folderId', folderId)   // folder_posts.folderId
        .order('createdAt', { ascending: false })
        .range(from, to);

    if (error) throw error;
    return data || [];
}

interface FolderPosts {
    id: number
    folderId: number
    sectionId: number
    userId: number
    posts: Post
    saved_items: SavedPost
    createdAt: string
}

export default function FolderPosts({ folderId, userId }: { folderId: number, userId: number }) {
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [posts, setPosts] = useState<FolderPosts[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMorePosts = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newPosts: FolderPosts[] = await getFolderPosts(folderId, userId, from, to)

        if (newPosts.length === 0 || newPosts.length < limit) {
            // Below code prevents hasMore from being set 
            // to false when component is first mounted
            if (offset === 0) setPosts([...posts, ...newPosts])
            setHasMore(false)
            setLoading(false)
            return
        }
        setOffset(offset + limit)
        setPosts([...posts, ...newPosts])
        setLoading(false)
    }

    // Call on first mount
    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated || loading || !hasMore) return
        if (inView) getMorePosts()
        console.log('inView', inView)
    }, [inView])

    if (!hydrated) return null


    return <>
        {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
        <ResponsiveMasonry
            columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6, 1750: 7, 2000: 8 }}>
            <Masonry>
                {posts.map((post) => (
                    <div key={post.id}>
                        <Image
                            loading="lazy"
                            className="object-cover"
                            alt={post.posts.media_alt_text}
                            src={post.posts.media_url}
                            width={post.posts.media_width}
                            height={post.posts.media_height}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                ))}
            </Masonry>
        </ResponsiveMasonry >
        <div ref={ref}>{loading ? "Calling getMorePosts" : "Not loading"}</div>
    </>
}

