"use client"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client"
import { getUsersFolders } from "@/lib/queries/folders"
import FolderCardComponent from "@/app/[username]/components/folders/folder-card"
import { FolderContextMenuWrapper } from "@/app/[username]/components/folders/ctx-menu"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { NoUserFolders, NoFoldersOrPrivate } from "@/app/[username]/components/folders/not-found";

const supabase = createClient();
export default function FoldersContainer(
    { userId, isMe }: { userId: string, isMe: boolean }
) {
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersFolders(supabase, userId),
            { pageSize: 10 });

    useEffect(() => {
        if (inView && !isValidating && loadMore) loadMore()
    }, [inView, isValidating, loadMore])

    if (data?.length === 0 && !isValidating && !loadMore) {
        if (isMe) return <NoUserFolders />
        return <NoFoldersOrPrivate />
    }

    return (
        <>
            <div id="folder-container">
                {data!.map((folder) =>
                    <FolderContextMenuWrapper
                        key={folder.id}
                        isOwner={isMe}
                        folder={folder}>
                        <FolderCardComponent data={folder} />
                    </FolderContextMenuWrapper>
                )}
            </div >
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )

}   