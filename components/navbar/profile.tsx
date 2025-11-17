"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUserContext } from '../userContext'

export const Avatar = () => {
    const { user } = useUserContext()
    if (!user) return null;
    return (
        <Link
            href={`/${user.username}`}
            className="relative rounded-full w-9 h-9 overflow-hidden">
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