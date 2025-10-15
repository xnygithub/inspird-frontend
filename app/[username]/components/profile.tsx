import React from 'react'
import UserSettings from '@/app/[username]/components/user-settings'
import { User } from '@/types/users'
import Banner from '@/app/[username]/components/banner'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'

interface Props {
    user: User
    isMe: boolean
    showBanner: boolean
}

const ProfileCard = (
    { user, isMe, showBanner }: Props
) => {

    if (showBanner) {
        return (
            <>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative w-full h-72">
                        <Banner url={user.bannerUrl} />
                        <div className="group bottom-0 left-1/2 absolute rounded-full outline-[var(--background)] outline-8 w-32 h-32 overflow-hidden -translate-x-1/2 translate-y-1/2">
                            <Avatar
                                url={user.avatarUrl}
                                className="group-hover:brightness-80 object-cover transition-all duration-200 select-none"
                                canEdit={isMe}
                            />
                        </div>
                    </div>

                    <div id="profile-info" className="mt-20">
                        <h2 className="font-semibold text-[24px]">{user.displayName}</h2>
                        <h1 className="opacity-80 font-normal text-[16px]">@{user.username}</h1>
                    </div>
                    <div className="space-x-2 mt-4">
                        {isMe ? (
                            <Button variant="genericRounded">
                                Edit Profile
                            </Button>
                        ) : (
                            <Button variant="genericRounded">
                                Follow
                            </Button>
                        )}
                        {isMe && <UserSettings />}
                    </div>
                </div >
            </>
        )
    }
    return (
        <div id="profile-container">
            <div id="profile-avatar">
                <Avatar
                    url={user.avatarUrl}
                    className="hover:brightness-80 object-cover transition-all duration-200"
                    canEdit={isMe}
                />
            </div>
            <div id="profile-info">
                <h2 className="font-semibold text-[24px]">{user.displayName}</h2>
                <h1 className="opacity-80 font-normal text-[16px]">@{user.username}</h1>
            </div>
            {isMe && <UserSettings />}
        </div >
    )
}

export default ProfileCard