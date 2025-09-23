"use client"
// TODO: Understand how callback, renders, state-changes really work here
import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef, useCallback } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { SavedPostWrapper } from '@/components/posts/wrappers'
import { getUsersPosts, GetUsersPostsResult } from '@/lib/client/posts'
import { UserProfile } from '@/app/[username]/page'

const LIMIT = 10

export default function PinsContainer({ user }: { user: UserProfile }) {
    const offsetRef = useRef<number>(0)
    const isRefInViewRef = useRef<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [posts, setPosts] = useState<GetUsersPostsResult[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMorePosts = useCallback(async () => {
        setLoading(true)
        const from = offsetRef.current
        const to = offsetRef.current + LIMIT - 1
        const newPosts = await getUsersPosts(user.id, from, to)

        if (newPosts.length === 0 || newPosts.length < LIMIT) {
            // Below code prevents hasMore from being set 
            // to false when component is first mounted
            if (offsetRef.current === 0) {
                setPosts(prevPosts => [...prevPosts, ...newPosts])
            }
            setHasMore(false)
            setLoading(false)
            return
        }
        offsetRef.current += LIMIT
        setPosts(prevPosts => [...prevPosts, ...newPosts])
        setLoading(false)
    }, [user.id])

    // Call on first mount
    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated || loading || !hasMore) return
        if (inView && !isRefInViewRef.current) {
            isRefInViewRef.current = true
            getMorePosts()
        }
        if (!inView) isRefInViewRef.current = false
    }, [inView, hydrated, loading, hasMore, getMorePosts])

    if (!hydrated) return null

    if (posts.length === 0 && !loading && !hasMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }

    return (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6, 1750: 7, 2000: 8 }}>
                <Masonry>
                    {posts.map((item) => (
                        <SavedPostWrapper post={item} key={item.posts.id}>
                            <Link href={`/posts/${item.posts.id}`} className="">
                                <Image
                                    loading="lazy"
                                    className="object-cover"
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
            <div ref={ref}></div>
        </>
    )
}   