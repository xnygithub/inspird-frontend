import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/types/users'
import Banner from '@/app/(app)/[username]/components/banner'
// import { Avatar } from '@/components/avatar'
// import { FollowersButton } from '@/app/(app)/[username]/components/followers'

interface Props {
    user: User
    isMe: boolean
    showBanner: boolean
}

const DisplayName = ({ displayName }: { displayName: string }) => {
    return (
        <span className="block mt-4 text-primary text-2xl leading-none tracking-tight">{displayName}
        </span>
    )
}

const Username = ({ username }: { username: string }) => {
    return (
        <span className="mt-1.5 text-muted-foreground leading-none">
            <span className='text-sm'>@</span>{username}
        </span>
    )
}

const CoreButton = ({ isMe }: { isMe: boolean }) => {
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

const UserAvatar = ({ url }: { url: string }) => {
    return (
        <Image
            fill
            src={url}
            alt="Avatar"
            className="object-cover select-none"
        />
    )
}

const FollowersButton = ({ followers, following }: { followers: number, following: number }) => {
    return (
        <div className='flex flex-row gap-2 mt-2'>
            <button className='font-sans text-primary text-sm decoration-1 hover:underline underline-offset-4 cursor-pointer'>
                {followers} Followers
            </button>
            <button className='font-sans text-primary text-sm decoration-1 hover:underline underline-offset-4 cursor-pointer'>
                {following} Following
            </button>
        </div>
    )
}

const ProfileCard = (
    { user, isMe, showBanner }: Props
) => {

    if (showBanner) {
        return (
            <>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative w-full h-72 max-md:h-36 transition-all duration-500">
                        <Banner url={user.bannerUrl} />
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
            {/* {isMe &&
                <CustomLink
                    href='/settings'
                    text='Settings'
                    variant='default'
                    className='mt-8 px-6 py-2 rounded-full font-sans font-medium bg-text-primary-foreground text-primary text-base' />

            } */}
        </div >
    )
}

export default ProfileCard