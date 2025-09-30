"use client"

import React, { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client"
import { getUsersFolders } from "@/lib/queries/folders"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import FolderCard from "@/app/[username]/components/preview"
import { FolderCardType } from "@/app/[username]/types"

const supabase = createClient();
export default function FoldersContainer({ userId }: { userId: string }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersFolders(supabase, userId),
            { pageSize: 10 }
        );

    const folders = data as FolderCardType[] | undefined;

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated || isValidating || !loadMore) return;
        if (inView) loadMore()
    }, [inView, hydrated, isValidating, loadMore])

    if (!hydrated) return null

    return (
        <>
            {folders?.length === 0 && !isValidating && !loadMore && <div className="flex justify-center items-center h-full">
                <p>No folders found</p>
            </div>}
            <div id="folder-container">
                {folders!.map((folder) => (<FolderCard key={folder.id} folder={folder} />))}
            </div>
            <div ref={ref}></div>
        </>
    )

}   