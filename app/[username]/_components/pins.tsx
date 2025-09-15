"use client"

import Image from 'next/image'
import { Post, Profile, SavedItems } from '@/app/generated/prisma'
import { getUsersPosts } from '@/lib/client/posts'
import { useState, useEffect } from 'react'
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useInView } from "react-intersection-observer";
import Link from 'next/link'

interface extendedSavedPost extends SavedItems {
    posts: Post & { users: Profile }
}

export default function PinsContainer({ user }: { user: Profile }) {
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [posts, setPosts] = useState<extendedSavedPost[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMorePosts = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newPosts: extendedSavedPost[] = await getUsersPosts(user.id, from, to)

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
    }, [inView])

    if (!hydrated) return null

    if (posts.length === 0) return <div className="mt-10 text-center">No posts found</div>

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
            <div ref={ref}>{inView ? "Calling getMorePosts" : "Not loading"}</div>
        </>
    )
}   