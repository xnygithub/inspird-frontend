"use client"
import { BreadcrumbItem, BreadcrumbList, Breadcrumb, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export const NavigationBar = () => {
    const pathname = usePathname()
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated) return null

    // Get the username, folder name, 
    // and folder section from the pathname
    const array = pathname.split("/")
    const username = array[1]
    const folderName = array[2]
    let folderSection = null
    if (array.length === 3) {
        folderSection = array[3]
    }

    return (
        <Breadcrumb>
            <BreadcrumbList >
                <BreadcrumbItem >
                    <BreadcrumbLink href={`/${username}`}>{username}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{folderName}</BreadcrumbItem>
                {folderSection && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem >{folderSection}</BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}