'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Post } from '@/app/generated/prisma'

const range = 10
export default function Similar({ data }: { data: Post }) {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => {
        setHydrated(true)
    }, [])
    if (!hydrated) return null
    return (
        <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
            <Masonry>
                {Array.from({ length: range }).map((_, index) => (
                    <div key={index} className="similar-post-container">
                        <Link href={`/posts/${data.id}`}>
                            <Image
                                loading="lazy"
                                className="object-cover"
                                alt={data.mediaAltText}
                                src={data.mediaUrl}
                                width={data.mediaWidth}
                                height={data.mediaHeight}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Link>
                    </div>
                ))}
            </Masonry>
        </ResponsiveMasonry>
    )
}