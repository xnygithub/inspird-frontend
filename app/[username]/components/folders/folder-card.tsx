import Link from 'next/link'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import React, { useMemo } from 'react'
import { timeAgo } from '@/utils/timeAgo'
import { getMediaUrl } from '@/utils/urls'
import defaultImage from '@/public/gray.png'
import { FolderCard } from '@/types/folders'

const FolderCardComponent = (
    { data }: { data: FolderCard }
) => {
    const getFolderThumbnail = (folder: FolderCard) => {
        if (folder.thumbnails && folder.thumbnails[0]) {
            return getMediaUrl(folder.thumbnails[0])
        }
        return defaultImage
    }
    const str = useMemo(() => data.postCount === 1 ? "Post" : "Posts", [data.postCount])

    return (
        <div className="space-y-1">
            <div className="relative aspect-square">
                <Link href={`/${data.ownerUsername}/${data.slug}`} >
                    <Image fill alt="Image" className="object-cover"
                        src={getFolderThumbnail(data)}
                        sizes="(max-width: 768px) 100vw, 256px" />
                </Link>
                {data.isPrivate &&
                    <div className="top-2 right-2 absolute bg-black/80 p-2 rounded-full">
                        <Lock size={16} />
                    </div>}
            </div>
            <div className="font-semibold">
                <h3 className="truncate">{data.name}</h3>
                <div className="flex justify-between opacity-50 font-normal text-sm">
                    <span>{data.postCount} {str}</span>
                    <span>{timeAgo(data.lastUpdated)}</span>
                </div>
            </div>
        </div>
    )
}

export default FolderCardComponent