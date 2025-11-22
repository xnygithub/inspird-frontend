import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/types/users'
import { FollowersButton } from '@/app/(app)/[username]/components/followers'
import UserBanner from '@/app/(app)/[username]/components/custom-banner'


function DisplayName({ displayName }: { displayName: string }) {
    return (
        <span className="block mt-4 text-primary text-2xl leading-none tracking-tight">{displayName}
        </span>
    )
}

function Username({ username }: { username: string }) {
    return (
        <span className="mt-1.5 text-muted-foreground leading-none">
            <span className='text-sm'>@</span>{username}
        </span>
    )
}

function CoreButton({ isMe }: { isMe: boolean }) {
    return (
        <div className='flex flex-row gap-2 mt-4'>
            {isMe && <Link
                href='/settings'
                className='inline-flex items-center gap-2 bg-secondary px-6 py-2.5 rounded-full font-sans text-secondary-foreground text-sm'>
                {/* <UserPlus className='size-4' /> */}
                Settings
            </Link>}

            {!isMe && <Link
                href='/settings'
                className='inline-flex items-center gap-2 bg-secondary px-6 py-2.5 rounded-full font-sans text-secondary-foreground text-sm'>
                {/* <UserPlus className='size-4' /> */}
                Follow
            </Link>}
        </div>
    )
}

function UserAvatar({ url }: { url: string }) {
    return (
        <Image
            fill
            src={url}
            alt="Avatar"
            className="object-cover select-none"
        />
    )
}


export function ProfileCard({
    user,
    isMe,
    showBanner
}: {
    user: User
    isMe: boolean
    showBanner: boolean
}
) {
    if (showBanner) {
        return (
            <>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative w-full h-[300px]">
                        <UserBanner url={user.bannerUrl} />
                        <div className="bottom-0 left-1/2 absolute rounded-full outline-[var(--background)] outline-8 w-32 h-32 overflow-hidden -translate-x-1/2 translate-y-1/2">
                            <UserAvatar url={user.avatarUrl} />
                        </div>
                    </div>

                    <div id="profile-info" className="mt-[5rem] font-sans">
                        <DisplayName displayName={user.displayName} />
                        <Username username={user.username} />
                        <FollowersButton followers={2} following={3} />
                        <CoreButton isMe={isMe} />
                    </div>
                </div >
            </>
        )
    }

    return (
        <div id="profile-container">
            <div id="profile-avatar" className="mt-16">
                <UserAvatar url={user.avatarUrl} />
            </div>
            <DisplayName displayName={user.displayName} />
            <Username username={user.username} />
            <FollowersButton followers={20} following={10} />
            <CoreButton isMe={isMe} />
        </div >
    )
}

export default ProfileCard