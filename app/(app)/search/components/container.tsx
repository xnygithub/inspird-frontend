"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Masonry from "react-responsive-masonry"
import { Loader2 } from 'lucide-react'
import { getMediaUrl } from '@/utils/urls'

export const Container = ({ query }: { query: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [fetched, setFetched] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            const res = await fetch('/api/search', {
                method: 'POST',
                body: JSON.stringify({ query: query })
            })
            if (!res.ok) {
                setError(res.statusText)
                setLoading(false)
                setFetched(true)
                return
            }
            const data = await res.json()
            if (data.error) {
                setError(data.error)
                setLoading(false)
                setFetched(true)
                return
            }
            setData(data.data)
            setLoading(false)
            setFetched(true)
        }
        void fetchData()
    }, [query])

    if (fetched && !loading && !data) return (
        <div className="font-sans text-muted-foreground text-xl text-center">
            No results found for &quot;{query}&quot;
        </div>
    )

    return (
        <>
            <Masonry columnsCount={4} gutter="10px" >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data && data.map((item: any) => (
                    <div
                        key={item.id}
                        className="relative w-full cursor-pointer">
                        <Image
                            key={item.id}
                            src={getMediaUrl(item.mediaUrl)}
                            alt={item.mediaAltText || ''}
                            width={item.mediaWidth}
                            height={item.mediaHeight}
                            className={` object-cover`}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div >
                ))}
            </Masonry>
            {loading && <Loader2 className="animate-spin" />}
        </>
    )
}