"use client"
import Image from 'next/image'
import React from 'react'
import { useUserContext } from '@/components/userContext'

export default function Avatar() {
    const { user: currentUser } = useUserContext()
    if (!currentUser) return null;
    return (
        <div className='px-2 pb-3 border-b'>
            <div className='relative justify-center items-center mx-auto mb-4 rounded-full outline-[2px] outline-primary/80 w-28 h-28 overflow-hidden'>
                <Image
                    fill
                    alt='Avatar'
                    src={currentUser.avatarUrl}
                    className='object-cover'
                />
            </div>
            <div className='flex flex-col justify-center items-start'>
                <span className='font-semibold text-xl'>{currentUser.displayName}</span>
                <span className='font-medium text-muted-foreground text-sm'>@{currentUser.username}</span>
            </div>
        </div>
    )
}
