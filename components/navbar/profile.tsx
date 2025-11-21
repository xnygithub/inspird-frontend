"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useUserContext } from '@/components/userContext'

export const Avatar = () => {
    const { user } = useUserContext()
    const pathname = usePathname()
    if (!user) return null;
    return (
        <Link
            href={`/${user.username}`}
            className={cn("relative rounded-full w-9 h-9 overflow-hidden",
                pathname === `/${user.username}` && " outline-2 outline-primary")}>
            <Image
                fill
                alt="Avatar"
                priority
                src={user.avatarUrl}
                className="object-cover"
            />
        </Link>
    )
}