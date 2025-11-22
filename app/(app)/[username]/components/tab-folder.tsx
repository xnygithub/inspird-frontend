"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { timeAgo } from '@/utils/timeAgo'
import { getMediaUrl } from '@/utils/urls'
import defaultImage from '@/public/gray.png'
import { FolderSummary } from '@/types/folders'
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client"
import { getUsersFolders } from "@/lib/queries/folders"
import { useProfile } from '@/app/(app)/[username]/components/provider';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { FolderContextMenuWrapper } from "@/app/(app)/[username]/components/folders/ctx-menu"
import { NoUserFolders, NoFoldersOrPrivate } from "@/app/(app)/[username]/components/folders/not-found";


const supabase = createClient();

// const type = ProfileFolder 

function FolderThumbnails(data: FolderSummary) {

    // Return if the user has set a thumbnail for the folder
    if (data.thumbnail) {
        return (
            <Link href={`/${data.ownerUsername}/${data.slug}`} >
                <div className='relative w-full aspect-square overflow-hidden'>
                    <Image src={data.thumbnail} alt={data.thumbnail} fill className='object-cover' />
                </div>
            </Link>
        )
    }

    // Will be returned if the user has not saved any images into the folder
    if (!data.previews || data.previews.length === 0) {
        return (
            <Link href={`/${data.ownerUsername}/${data.slug}`} >
                <div className='relative w-full aspect-square overflow-hidden'>
                    <Image
                        fill
                        src={defaultImage}
                        alt="Default Image"
                        className='brightness-20 object-cover' />
                </div>
            </Link>
        )
    }

    // Will be returned if the user has saved images into the folder
    return (
        <Link href={`/${data.ownerUsername}/${data.slug}`} >
            <div className='gap-2 grid grid-cols-2 grid-rows-2'>
                {data.previews.map((preview, index) => {
                    const url = getMediaUrl(preview);
                    return (
                        <div key={index} className='relative w-full aspect-square overflow-hidden'>
                            <Image src={url} alt={preview} fill className='object-cover' />
                        </div>
                    )
                })}
            </div>
        </Link>
    )
}

export function FolderTab() {
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
            <div className='gap-4 grid grid-cols-[repeat(auto-fill,minmax(min(14rem,40%),1fr))]'>
                {data!.map((folder) =>
                    <FolderContextMenuWrapper
                        key={folder.id}
                        isOwner={isMe}
                        folder={folder}>
                        <FolderPreview data={folder} />
                    </FolderContextMenuWrapper>
                )}
            </div >
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )
}


function FolderPreview({ data }: { data: FolderSummary }) {

    const itemStr = useMemo(
        () => data.postCount === 1 ? "Post" : "Posts",
        [data.postCount]
    )
    const lastUpdated = useMemo(
        () => timeAgo(data.lastUpdated),
        [data.lastUpdated]
    )

    return (
        <div className='flex flex-col gap-2 font-sans text-primary'>
            <div className='rounded-lg overflow-hidden'>
                <FolderThumbnails {...data} />
            </div>
            <div className='px-0.5'>
                <span className="font-medium">{data.name}</span>
                <div className="flex justify-between text-muted-foreground text-xs leading-none">
                    <span>{data.postCount} {itemStr}</span>
                    <span>{lastUpdated}</span>
                </div>
            </div>
        </div>
    )
}

export default FolderTab;