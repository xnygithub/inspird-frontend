"use client"
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Profile } from '@/app/generated/prisma/client'

export const Avatar = ({ res }: { res: Profile }) => {
    const [currentPath, setCurrentPath] = useState<string>(usePathname())
    const pathname = usePathname()
    useEffect(() => {
        if (pathname.includes(`/settings`)) {
            if (currentPath.includes(`/${res.username}`)) return
            setCurrentPath(pathname)
        }
        else setCurrentPath(pathname)
    }, [pathname, currentPath, res.username])

    const isProfilePage = currentPath.includes(`/${res.username}`)
    return (
        <Link href={`/${res.username}`} className="relative">
            <div className={cn("relative rounded-full w-8 h-8 overflow-hidden",
                isProfilePage && "outline-[2px] outline-primary/70 ")}>
                <Image
                    src={res.avatarUrl}
                    alt="Avatar"
                    fill
                    sizes="32px"
                    className="object-cover"
                    priority
                />
            </div>
        </Link>
    )
}