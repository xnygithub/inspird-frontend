"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { getUsersCanvasDocs } from "@/lib/queries/canvas"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client";
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import DeleteButton from "@/components/canvas/delete-button"
import { useProfile } from '@/app/(app)/[username]/components/provider';
import { timeAgo } from '@/utils/timeAgo'

const supabase = createClient();

export const CanvasTab = () => {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });
    const { user, sort } = useProfile();
    const ascending = sort.canvas === 'latest' ? false : true;
    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersCanvasDocs(supabase, user.id)
                .order('createdAt', { ascending }),
            { pageSize: 10, revalidateFirstPage: false }
        );

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    if (!hydrated) return null

    if (data?.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No canvas docs found</div>
    }

    const src = "https://s3-alpha.figma.com/thumbnails/3c388d95-4b74-4b8d-a11f-a71601e65059?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ4GOSFWC6QFF5XMF%2F20251120%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251120T000000Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=9f974f1b6b60af0d9d245fe42560504433db6bc42ed4722fe9323f725091661d"

    return (
        <>
            <div id="canvas-container" className="font-sans">
                {data && data.map((canvasDoc) => (
                    <div key={canvasDoc.id}>
                        <Link href={`/${canvasDoc.owner.username}/canvas/${canvasDoc.slug}`}>
                            <img src={src}
                                className="bg-gray-200/30 h-48 object-cover aspect-16/9 squircle"
                                alt={canvasDoc.title} />
                            <div className="flex flex-row justify-between mt-1">
                                <span className="block font-medium text-sm">{canvasDoc.title}</span>
                                <span className="text-muted-foreground text-sm">{timeAgo(canvasDoc.createdAt)}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )

}

export default CanvasTab;