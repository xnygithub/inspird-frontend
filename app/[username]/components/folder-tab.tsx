"use client"

import React, { useEffect, useState } from "react"
import { getUsersFolders } from "@/lib/client/folders"
import { useInView } from "react-intersection-observer"
import { Folder, Profile } from "@/app/generated/prisma"
import Link from "next/link"


interface FoldersContainerProps {
    user: Profile
}

export default function FoldersContainer({ user }: FoldersContainerProps) {
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [folders, setFolders] = useState<Folder[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMoreFolders = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newFolders: Folder[] = await getUsersFolders(user.id, from, to)

        if (newFolders.length === 0 || newFolders.length < limit) {
            // Below code prevents hasMore from being set 
            // to false when component is first mounted
            if (offset === 0) setFolders([...folders, ...newFolders])
            setHasMore(false)
            setLoading(false)
            return
        }
        setOffset(offset + limit)
        setFolders([...folders, ...newFolders])
        setLoading(false)
    }

    // Call on first mount
    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated || loading || !hasMore) return
        if (inView) getMoreFolders()
    }, [inView])

    if (!hydrated) return null

    if (folders.length === 0 && !loading && !hasMore) {
        return <div className="mt-10 text-center">No folders found</div>
    }

    return (
        <>
            <div id="folder-container" >
                {folders.map((folder) => (
                    <Link href={`/${user.username}/${folder.slug}`} key={folder.id}>
                        {!folder.thumbnail && <div id="folder-thumbnail"></div>}
                        <h2>{folder.name}</h2>
                    </Link>
                ))}
            </div>
            <div ref={ref}></div>
        </>
    )

}   