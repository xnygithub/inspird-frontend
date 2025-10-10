"use client"
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Profile } from '@/app/generated/prisma/client'
import { cn } from '@/lib/utils'

export const Avatar = ({ res }: { res: Profile }) => {
    const pathname = usePathname()
    // Check whether the user is on the profile page
    const isProfilePage = pathname.includes(`/${res.username}`)
    return (
        <Link href={`/${res.username}`} className="relative">
            <div className={cn("relative rounded-full w-8 h-8 overflow-hidden",
                isProfilePage && "outline-[2px] outline-primary/70")}>
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