'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Masonry } from 'masonic'
import { SimilarPost } from '@/types/posts'
import { getSimilarPosts } from '@/lib/queries/posts'
import { createClient } from '@/utils/supabase/client'
import { MasonryItem } from '@/components/posts/masonry-item'

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
        <div className="px-4 w-full">
            <Masonry
                columnWidth={250}
                items={similarPosts}
                rowGutter={15}
                columnGutter={15}
                render={MasonryItem}
            />
        </div>
    )
}