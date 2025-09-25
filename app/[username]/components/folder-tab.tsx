"use client"

import React, { useEffect, useState } from "react"
import { getUsersFolders } from "@/lib/client/folders"
import { useInView } from "react-intersection-observer"
import { Profile } from "@/app/generated/prisma"
import FolderCard from "@/app/[username]/components/preview"
import { FolderCardType } from "@/app/[username]/types"
import { createClient } from "@/utils/supabase/client"


interface FoldersContainerProps {
    user: Profile
}

export default function FoldersContainer({ user }: FoldersContainerProps) {
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [folders, setFolders] = useState<FolderCardType[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMoreFolders = async () => {
        const client = await createClient()
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newFolders = await getUsersFolders(client, user.id, from, to)
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
            <div id="folder-container">
                {folders.map((folder) => (<FolderCard key={folder.id} folder={folder} />))}
            </div>
            <div ref={ref}></div>
        </>
    )

}   