'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Post } from '@/app/generated/prisma'
import { createClient } from '@/utils/supabase/client'

const getAllPosts = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("createdAt", { ascending: false })
    if (error) throw new Error(error.message)
    return data
}

export default function Similar({ data }: { data: Post }) {
    const [hydrated, setHydrated] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    useEffect(() => {
        setHydrated(true)
        getAllPosts().then(setPosts)
    }, [])
    if (!hydrated) return null
    return (
        <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
            <Masonry>
                {posts.map((post) => (
                    <div key={post.id} className="similar-post-container">
                        <Link href={`/posts/${post.id}`}>
                            <Image
                                loading="lazy"
                                className="object-cover"
                                alt={post.mediaAltText}
                                src={post.mediaUrl}
                                width={post.mediaWidth}
                                height={post.mediaHeight}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Link>
                    </div>
                ))}
            </Masonry>
        </ResponsiveMasonry>
    )
}