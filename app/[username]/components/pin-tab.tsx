"use client"
import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from 'react'
import { getUsersPosts } from '@/lib/queries/posts';
import { createClient } from "@/utils/supabase/client";
import { SavedPostWrapper } from '@/components/posts/wrappers'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { PIN_MASONRY } from "@/constants/masonry";

const supabase = createClient();

export default function PinsContainer({ userId }: { userId: string }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersPosts(supabase, userId),
            { pageSize: 10 }
        );

    useEffect(() => { setHydrated(true) }, [])

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    if (!hydrated) return null

    if (data?.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }

    return (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={PIN_MASONRY}>
                <Masonry>
                    {data && data.map((item, index) => (
                        <SavedPostWrapper
                            key={item.posts.id}
                            postId={item.posts.id}
                            ownerUsername={item.posts.users.username}>
                            <Link href={`/posts/${item.posts.id}`} >
                                <Image
                                    className="object-cover"
                                    priority={index < 10}
                                    alt={item.posts.mediaAltText}
                                    src={item.posts.mediaUrl}
                                    width={item.posts.mediaWidth}
                                    height={item.posts.mediaHeight}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Link>
                        </SavedPostWrapper>
                    ))}
                </Masonry>
            </ResponsiveMasonry >
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )
}   