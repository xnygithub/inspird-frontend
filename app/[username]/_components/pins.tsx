"use client"

import Image from 'next/image'
import { Post, Users } from '@/app/generated/prisma'
import { getUsersPosts } from '@/app/[username]/actions'
import { useState, useEffect, useMemo } from 'react'
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

interface PinsContainerProps {
    user_id: number
}

export default function PinsContainer({ user_id }: PinsContainerProps) {
    const limit = 10
    const [posts, setPosts] = useState<(Post & { users: Users })[]>([])
    const [offset, setOffset] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [hydrated, setHydrated] = useState<boolean>(false)

    const getMorePosts = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newPosts: (Post & { users: Users })[] = await getUsersPosts(user_id, from, to)

        // If there are no more posts, set hasMore to false
        if (newPosts.length === 0 || newPosts.length < limit) {
            if (offset === 0) {
                setPosts([...posts, ...newPosts])
            }
            setHasMore(false)
            setLoading(false)
            return
        }
        setOffset(offset + limit)
        setPosts([...posts, ...newPosts])
        setLoading(false)
    }

    const columnsCountBreakPoints = useMemo(() => {
        return { 200: 2, 400: 2, 600: 3, 800: 4, 1000: 5, }
    }, [])


    // Call getMorePosts when the component mounts
    useEffect(() => {
        setHydrated(true)
        getMorePosts()
    }, [])
    if (!hydrated) return null

    return (
        <>
            <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
                <Masonry>
                    {
                        posts.map((post) => (
                            <div key={post.id} className="group relative w-full h-full">
                                <Image
                                    alt="Post"
                                    src={post.media_url}
                                    loading="lazy"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="object-cover"
                                    style={{ width: '100%', height: 'auto' }} // optional
                                />
                                <p id="pin-save-label">Save</p>
                                {post.users.id === user_id && <p id="pin-username-label" >{post.users.username}</p>}
                            </div>
                        ))
                    }
                </Masonry>
            </ResponsiveMasonry>


            <button
                onClick={getMorePosts}
                disabled={loading || !hasMore}>
                {loading ? "Loading..." : "Load more"}
            </button>

        </>
    )
}   