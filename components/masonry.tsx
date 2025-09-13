"use client"

import React, { useEffect, useState } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

export default function MasonryGrid({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState<boolean>(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated) return null
    return (
        <>
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
                <Masonry>
                    {children}
                </Masonry>
            </ResponsiveMasonry >
        </>
    )
}   
