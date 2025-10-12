"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { getUsersCanvasDocs } from "@/lib/queries/canvas"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client";
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import DeleteButton from "@/components/canvas/delete-button"

const supabase = createClient();
export default function CanvasContainer({ userId }: { userId: string }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersCanvasDocs(supabase, userId),
            { pageSize: 10 }
        );

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    if (!hydrated) return null

    if (data?.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No canvas docs found</div>
    }

    return (
        <>
            <div id="canvas-container" >
                {data && data.map((canvasDoc) => (
                    <div key={canvasDoc.id}>
                        <Link href={`/${canvasDoc.owner.username}/canvas/${canvasDoc.title}`}>
                            <div className="bg-gray-200/30 w-full h-full"></div>
                            <h2>{canvasDoc.title}</h2>
                        </Link>
                        <DeleteButton canvasId={canvasDoc.id} />
                    </div>
                ))}
            </div>
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )

}   