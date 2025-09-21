import { Post, Profile } from '@/app/generated/prisma'
import React from 'react'


interface PostWrapperProps {
    post: Post & { users: Profile }
    config: {
        showUsername: boolean
        showSave: boolean
    }
    children: React.ReactNode
}

const usernameLabel = (username: string) => {
    return (
        <div id="pin-username-label">
            {username}
        </div>
    )
}

const saveLabel = () => {
    return (
        <div id="pin-save-label">
            Save
        </div>
    )
}

export const PostWrapper = ({ post, children, config }: PostWrapperProps) => {
    return (
        <div className="group relative">
            {children}
            {config.showUsername && usernameLabel(post.users.username)}
            {config.showSave && saveLabel()}
        </div>
    )
}