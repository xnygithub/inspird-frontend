import React from 'react'
import { SaveLabel as SaveLabelComponent } from '@/components/posts/save'
import { QuicksaveLabel } from '@/components/posts/quicksave'
import { GetUsersPostsResult } from '@/lib/client/posts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SavedPostWrapperProps {
    post: GetUsersPostsResult
    children: React.ReactNode
}

export const SavedPostWrapper = ({ post, children }: SavedPostWrapperProps) => {
    // This should wrap posts when the user is viewing posts they have saved/created
    // Used in: A user viewing their own profile/folders
    return (
        <div className="group relative w-full">
            {children}
            <Link href={`/${post.posts.users.username}`}>
                <Button id="pin-username-label">
                    {post.posts.users.username}
                </Button>
            </Link>
            <div id="pin-save-label">
                <QuicksaveLabel disabled={true} postId={post.posts.id} />
                <SaveLabelComponent postId={post.posts.id} />
            </div>
        </div>
    )
}