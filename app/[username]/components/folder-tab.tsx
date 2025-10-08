"use client"
import Link from "next/link"
import Image from "next/image"
import { Lock } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { createClient } from "@/utils/supabase/client"
import { getUsersFolders } from "@/lib/queries/folders"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { FolderCard } from "@/types/folders"
import defaultImage from "@/public/gray.png"
import { timeAgo } from "@/utils/timeAgo"
import { getMediaUrl } from "@/utils/urls"

const supabase = createClient();
export default function FoldersContainer({ userId }: { userId: string }) {
    const [hydrated, setHydrated] = useState<boolean>(false)
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersFolders(supabase, userId),
            { pageSize: 10 }
        );

    const folders = data as FolderCard[] | undefined;

    useEffect(() => setHydrated(true), [])

    useEffect(() => {
        if (!hydrated || isValidating || !loadMore) return;
        if (inView) loadMore()
    }, [inView, hydrated, isValidating, loadMore])

    if (!hydrated) return null

    if (folders?.length === 0 && !isValidating && !loadMore) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>No folders found</p>
            </div>
        )
    }

    const getFolderThumbnail = (folder: FolderCard) => {
        if (folder.thumbnails && folder.thumbnails[0]) {
            return getMediaUrl(folder.thumbnails[0])
        }
        return defaultImage
    }

    return (
        <>
            <div id="folder-container">
                {folders!.map((folder) => (
                    <div className="space-y-0.5" key={folder.id}>
                        <div className="relative w-full aspect-[4/3]">
                            {folder.isPrivate &&
                                <div className="top-1 right-1 z-10 absolute bg-black/80 p-2 rounded-full pointer-events-none">
                                    <Lock size={16} />
                                </div>
                            }
                            <Link href={`/${folder.ownerUsername}/${folder.slug}`}>
                                <div className="absolute inset-0">
                                    <Image
                                        src={getFolderThumbnail(folder)}
                                        alt="Image"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 256px"
                                        priority={false}
                                    />
                                </div>
                            </Link>

                        </div>
                        <div className="-space-y-0.5">
                            <p className="font-semibold text-[14px]">{folder.name}</p>
                            <div className="flex flex-row justify-between">
                                <p className="font-semibold text-[12px] text-gray-500">
                                    {folder.postCount} {folder.postCount === 1 ? "Post" : "Posts"}
                                </p>
                                <p className="font-semibold text-[12px] text-gray-500">
                                    {timeAgo(folder.lastUpdated)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!isValidating && loadMore && <div ref={ref}></div>}
        </>
    )

}   