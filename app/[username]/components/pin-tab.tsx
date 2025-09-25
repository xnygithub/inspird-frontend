"use client"
import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from 'react'
import { UserProfile } from '@/app/[username]/page'
import { getUsersPosts } from '@/lib/queries/posts';
import { createClient } from "@/utils/supabase/client";
import { SavedPostWrapper } from '@/components/posts/wrappers'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';

const PAGE_SIZE = 10
const supabase = createClient();

export default function PinsContainer({ user }: { user: UserProfile }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersPosts(supabase, user.id),
            { pageSize: PAGE_SIZE }
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
            <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6, 1750: 7, 2000: 8 }}>
                <Masonry>
                    {data && data.map((item) => (
                        <SavedPostWrapper
                            key={item.posts.id}
                            postId={item.posts.id}
                            ownerUsername={item.posts.users.username}>
                            <Link href={`/posts/${item.posts.id}`} >
                                <Image
                                    loading="lazy"
                                    className="object-cover"
                                    sizes="10vw"
                                    alt={item.posts.mediaAltText}
                                    src={item.posts.mediaUrl}
                                    width={item.posts.mediaWidth}
                                    height={item.posts.mediaHeight}
                                    style={{ width: '500%', height: 'auto' }}

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