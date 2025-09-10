"use client"

import Image from 'next/image'
import { Post, Users } from '@/app/generated/prisma'
import { getUsersPosts } from '@/services/posts'
import { useState } from 'react'

interface PinsContainerProps {
    user_id: number
    limit: number
    initialOffset: number
}

export default function PinsContainer({ user_id, limit, initialOffset }: PinsContainerProps) {
    const [posts, setPosts] = useState<(Post & { users: Users })[]>([])
    const [offset, setOffset] = useState<number>(initialOffset)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const getMorePosts = async () => {
        const from = offset
        const to = offset + limit - 1
        const newPosts: (Post & { users: Users })[] = await getUsersPosts(user_id, from, to)
        if (newPosts.length === 0) {
            setHasMore(false)
        }
        setOffset(offset + limit)
        setPosts([...posts, ...newPosts])
    }

    return (
        <>
            <div id="pin-container">
                {
                    posts.map((post) => (
                        <div key={post.id} className="relative rounded-lg overflow-hidden">
                            <Image
                                alt="Post"
                                src={post.media_url}
                                width={160}
                                height={0}
                                loading="lazy"
                                style={{ height: "auto" }}
                                className="object-cover"
                            />
                            <p id="pin-save-label">Save</p>
                            <p id="pin-username-label" >{post.users.username}</p>
                        </div>
                    ))
                }
            </div>
            {hasMore && <button onClick={getMorePosts}>Load more</button>}
        </>
    )
}   