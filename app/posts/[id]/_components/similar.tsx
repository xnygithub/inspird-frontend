'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { createClient } from '@/utils/supabase/client'
import { STANDARD_COLUMN_BREAKPOINTS, SIDEBAR_COLUMN_BREAKPOINTS } from '@/constants/masonry'
import { useSidebar } from './sidebar.provider'
import { SimilarPost } from '@/types/posts'
import { getSimilarPosts } from '@/lib/queries/posts'
import { Button } from '@/components/ui/button'

export default function Similar({ postId }: { postId: string }) {
    const [hydrated, setHydrated] = useState(false)
    const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])
    const { open } = useSidebar()

    const supabase = createClient()

    const handleGetSimilarPosts = useCallback(async () => {
        const { data: posts, error } = await getSimilarPosts(supabase, postId)
        if (error) throw new Error(error.message)
        setSimilarPosts(posts)
    }, [supabase, postId])

    useEffect(() => {
        handleGetSimilarPosts()
    }, [handleGetSimilarPosts])

    useEffect(() => setHydrated(true), [])
    if (!hydrated) return null
    return (
        <div id="similar-posts-container">
            <ResponsiveMasonry
                columnsCountBreakPoints={open ? SIDEBAR_COLUMN_BREAKPOINTS : STANDARD_COLUMN_BREAKPOINTS}>
                <Masonry>
                    {similarPosts.map((post) => (
                        <div key={post.id} className="w-full">
                            <Link href={`/posts/${post.id}`}>
                                <Image
                                    loading="lazy"
                                    className="object-cover"
                                    alt={post.mediaalttext || ''}
                                    src={post.mediaurl}
                                    width={post.mediawidth}
                                    height={post.mediaheight}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Link>
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
            <Button onClick={() => handleGetSimilarPosts()}>Get similar posts</Button>
        </div>
    )
}