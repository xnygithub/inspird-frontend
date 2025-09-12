"use client"

import Image from 'next/image'
import { Post, Users, SavedPost } from '@/app/generated/prisma'
import { getUsersPosts } from '@/app/[username]/actions'
import { useState, useEffect } from 'react'
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useInView } from "react-intersection-observer";
import Link from 'next/link'

interface extendedSavedPost extends SavedPost {
    posts: Post & { users: Users }

}

export default function PinsContainer({ user_id }: { user_id: number }) {
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
        const newPosts: extendedSavedPost[] = await getUsersPosts(user_id, from, to)
        console.log("newPosts", newPosts)

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

    return (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
                <Masonry>
                    {posts.map((post) => (
                        <div className="group relative" key={post.id}>
                            <Link href={`/posts/${post.postId}`} className="group relative">
                                <Image
                                    loading="lazy"
                                    className="object-cover"
                                    alt={post.posts.media_alt_text}
                                    src={post.posts.media_url}
                                    width={post.posts.media_width}
                                    height={post.posts.media_height}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Link>
                            <p id="pin-username-label" >@{post.posts.users.username}</p>
                            <p id="pin-save-label">Save</p>
                        </div>

                    ))}
                </Masonry>
            </ResponsiveMasonry >
            <div ref={ref}>{loading ? "Calling getMorePosts" : "Not loading"}</div>
        </>
    )
}   