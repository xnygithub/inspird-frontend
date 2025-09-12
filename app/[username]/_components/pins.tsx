"use client"

import Image from 'next/image'
import { Post, Users, SavedPost } from '@/app/generated/prisma'
import { getUsersPosts } from '@/app/[username]/actions'
import { useState, useEffect } from 'react'
import React from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Link from 'next/link'

interface PinsContainerProps {
    user_id: number
}

interface extendedSavedPost extends SavedPost {
    posts: Post & { users: Users }

}

export default function PinsContainer({ user_id }: PinsContainerProps) {
    const limit = 10
    const [posts, setPosts] = useState<extendedSavedPost[]>([])
    const [offset, setOffset] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [hydrated, setHydrated] = useState<boolean>(false)

    const getMorePosts = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newPosts: extendedSavedPost[] = await getUsersPosts(user_id, from, to)
        console.log("newPosts", newPosts)


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


    // Call getMorePosts when the component mounts
    useEffect(() => {
        setHydrated(true)
        getMorePosts()
    }, [])
    if (!hydrated) return null

    return (
        <>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
                <Masonry>
                    {
                        posts.map((post) => (
                            <>
                                <Link href={`/posts/${post.postId}`} className="relative inset-0 w-full h-full">
                                    <div key={post.id} className="group z-[-10] relative w-full h-full">
                                        <Image
                                            alt="Post"
                                            src={post.posts.media_url}
                                            loading="lazy"
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="object-cover"
                                            style={{ width: '100%', height: 'auto' }}

                                        />

                                        <p id="pin-save-label">Save</p>
                                        {post.posts.users.id === user_id && <p id="pin-username-label" >{post.posts.users.username}</p>}
                                    </div>
                                </Link>
                            </>
                        ))
                    }

                </Masonry>
            </ResponsiveMasonry >


            <button
                onClick={getMorePosts}
                disabled={loading || !hasMore}>
                {loading ? "Loading..." : "Load more"}
            </button>

        </>
    )
}   