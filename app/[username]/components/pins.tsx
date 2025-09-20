"use client"

import React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef, useCallback } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Profile } from '@/app/generated/prisma'
import { getUsersPosts, GetUsersPostsResult } from '@/lib/client/posts'

const LIMIT = 10

export default function PinsContainer({ user }: { user: Profile }) {
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
            <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
                <Masonry>
                    {posts.map((post) => (
                        <div className="group relative" key={post.id}>
                            <Link href={`/posts/${post.posts.id}`} className="group relative">
                                <Image
                                    loading="lazy"
                                    className="object-cover"
                                    alt={post.posts.mediaAltText}
                                    src={post.posts.mediaUrl}
                                    width={post.posts.mediaWidth}
                                    height={post.posts.mediaHeight}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Link>
                            <p id="pin-username-label" >@{post.posts.users.username}</p>
                            <p id="pin-save-label">Save</p>
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry >
            <div ref={ref}></div>
        </>
    )
}   