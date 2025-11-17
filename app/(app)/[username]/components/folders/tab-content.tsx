"use client"
import React, { useEffect } from "react"
import { useProfile } from '@/app/(app)/[username]/components/provider';
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client"
import { getUsersFolders } from "@/lib/queries/folders"
import FolderCardComponent from "@/app/(app)/[username]/components/folders/folder-card"
import { FolderContextMenuWrapper } from "@/app/(app)/[username]/components/folders/ctx-menu"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { NoUserFolders, NoFoldersOrPrivate } from "@/app/(app)/[username]/components/folders/not-found";

const supabase = createClient();

export const FolderTab = (
) => {
    const { ref, inView } = useInView({ threshold: 0 });
    const { user, isMe, sort } = useProfile();
    const ascending = sort.folders === 'latest' ? false : true;
    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersFolders(supabase, user.id)
                .order('createdAt', { ascending }),
            { pageSize: 10, revalidateFirstPage: false });

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

export default FolderTab;