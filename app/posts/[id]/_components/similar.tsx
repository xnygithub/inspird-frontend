'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { Masonry } from 'react-masonry'
import { getMediaUrl } from '@/utils/urls'
import { SimilarPost } from '@/types/posts'
import { Button } from '@/components/ui/button'
import { getSimilarPosts } from '@/lib/queries/posts'
import { createClient } from '@/utils/supabase/client'

export default function Similar({ postId }: { postId: string }) {
    const [hydrated, setHydrated] = useState(false)
    const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])

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
            <Masonry>
                {similarPosts.map((post) => (
                    <div key={post.id} className="masonry-box masonry-item" >
                        <Link href={`/posts/${post.id}`}>
                            <Image
                                loading="lazy"
                                className="object-cover"
                                alt={post.mediaAltText || ''}
                                src={getMediaUrl(post.mediaUrl)}
                                width={post.mediaWidth}
                                height={post.mediaHeight}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Link>
                    </div>
                ))}
            </Masonry>
            <Button onClick={() => handleGetSimilarPosts()}>Get similar posts</Button>
        </div>
    )
}