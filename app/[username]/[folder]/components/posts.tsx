"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import '@/app/[username]/[folder]/folder.css'
import { getFolderPosts } from '@/lib/queries/folders'
import { createClient } from '@/utils/supabase/client'
import { useInView } from 'react-intersection-observer'
import { SavedPostWrapper } from '@/components/posts/wrappers'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { PIN_MASONRY } from '@/constants/masonry'
import { FolderDetails } from '@/types/folders'

const supabase = createClient();

export default function FolderPosts({ folder }: { folder: FolderDetails }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getFolderPosts(supabase, folder.id),
            { pageSize: 10 }
        );

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated || isValidating || !loadMore) return
        if (inView) loadMore()
    }, [inView, hydrated, isValidating, loadMore])

    if (!hydrated) return null

    return (
        <div id="folder-posts-container">
            <ResponsiveMasonry columnsCountBreakPoints={PIN_MASONRY}>
                <Masonry>
                    {data?.map((post) => (
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

