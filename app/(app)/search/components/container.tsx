"use client"
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getMediaUrl } from '@/utils/urls'
import { MasonryGrid } from '@/app/(app)/[username]/components/masonry-grid'
import { MASONRY_BREAKPOINTS_CONFIG } from '@/types/config'
import { FeedMasonryItem } from '@/components/posts/masonry-item'

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
            <MasonryGrid
                gap={12}
                columns={2}
                columnBreakpoints={MASONRY_BREAKPOINTS_CONFIG} >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data && data.map((item: any) => (
                    <FeedMasonryItem
                        key={item.id}
                        data={item} />
                ))}
            </MasonryGrid>
            {loading && <Loader2 className="animate-spin" />}
        </>
    )
}