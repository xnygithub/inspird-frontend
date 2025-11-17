"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { getUsersCanvasDocs } from "@/lib/queries/canvas"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client";
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import DeleteButton from "@/components/canvas/delete-button"
import { useProfile } from '@/app/(app)/[username]/components/provider';

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

    return (
        <>
            <div id="canvas-container" >
                {data && data.map((canvasDoc) => (
                    <div key={canvasDoc.id}>
                        <Link href={`/${canvasDoc.owner.username}/canvas/${canvasDoc.slug}`}>
                            <div className="bg-gray-200/30 aspect-square"></div>
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

export default CanvasTab;