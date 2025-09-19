"use client"

import React, { useEffect, useState } from "react"
import { getUsersCanvasDocs } from "@/lib/client/canvas"
import { useInView } from "react-intersection-observer"
import { CanvasDoc, Profile } from "@/app/generated/prisma"
import Link from "next/link"


interface CanvasContainerProps {
    user: Profile
}

export default function CanvasContainer({ user }: CanvasContainerProps) {
    const limit = 10
    const [offset, setOffset] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [hydrated, setHydrated] = useState<boolean>(false)
    const [canvasDocs, setCanvasDocs] = useState<CanvasDoc[]>([])
    const { ref, inView } = useInView({ threshold: 0 });

    const getMoreCanvasDocs = async () => {
        setLoading(true)
        const from = offset
        const to = offset + limit - 1
        const newCanvasDocs: CanvasDoc[] = await getUsersCanvasDocs(user.id, from, to)

        if (newCanvasDocs.length === 0 || newCanvasDocs.length < limit) {
            // Below code prevents hasMore from being set 
            // to false when component is first mounted
            if (offset === 0) setCanvasDocs([...canvasDocs, ...newCanvasDocs])
            setHasMore(false)
            setLoading(false)
            return
        }
        setOffset(offset + limit)
        setCanvasDocs([...canvasDocs, ...newCanvasDocs])
        setLoading(false)
    }

    // Call on first mount
    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated || loading || !hasMore) return
        if (inView) getMoreCanvasDocs()
    }, [inView])

    if (!hydrated) return null

    if (canvasDocs.length === 0 && !loading && !hasMore) {
        return <div className="mt-10 text-center">No canvas docs found</div>
    }

    return (
        <>
            <div id="canvas-container" >
                {canvasDocs.map((canvasDoc) => (
                    <Link href={`/${user.username}/c/${canvasDoc.title}`} key={canvasDoc.id}>
                        <div className="bg-gray-200/30 w-full h-full"></div>
                        <h2>{canvasDoc.title}</h2>
                    </Link>
                ))}
            </div>
            <div ref={ref}></div>
        </>
    )

}   