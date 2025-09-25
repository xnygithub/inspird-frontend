"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import '@/app/[username]/[folder]/folder.css'
import { createClient } from '@/utils/supabase/client'
import { useInView } from 'react-intersection-observer'
import { Folder } from '@/app/generated/prisma'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { getFolderPosts } from '@/lib/queries/folders'
import { FolderPosts as FolderPostsType } from '@/app/[username]/[folder]/types'
import { SavedPostWrapper } from '@/components/posts/wrappers'
import Link from 'next/link'


export default function FolderPosts({ folder }: { folder: Folder }) {
    const supabase = createClient();
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [posts, setPosts] = useState<FolderPostsType[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMorePosts = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const { data, error } = await getFolderPosts(supabase, folder.userId, folder.id).range(from, to)
        console.log("folder posts data", data)
        if (error) throw error;

        if (data.length === 0 || data.length < limit) {
            // Below code prevents hasMore from being set 
            // to false when component is first mounted
            if (offset === 0) setPosts([...posts, ...data])
            setHasMore(false)
            setLoading(false)
            return
        }
        setOffset(offset + limit)
        setPosts([...posts, ...data])
        setLoading(false)
    }

    // Call on first mount
    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated || loading || !hasMore) return
        if (inView) getMorePosts()
    }, [inView])

    if (!hydrated) return null

    return (
        <div id="folder-posts-container">
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6, 1750: 7, 2000: 8 }}>
                <Masonry>
                    {posts.map((post) => (
                        <SavedPostWrapper
                            key={post.id}
                            postId={post.posts.id}
                            ownerUsername={post.posts.profiles.username}>
                            <Link href={`/posts/${post.posts.id}`}>
                                <Image
                                    key={post.id}
                                    loading="lazy"
                                    className="object-cover"
                                    alt={post.posts.mediaAltText}
                                    src={post.posts.mediaUrl}
                                    width={post.posts.mediaWidth}
                                    height={post.posts.mediaHeight}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Link>
                        </SavedPostWrapper>
                    ))}
                </Masonry>
            </ResponsiveMasonry >
            <div ref={ref}></div>
        </div>
    )
}

