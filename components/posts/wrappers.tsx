import React from 'react'
import { SaveLabel as SaveLabelComponent } from '@/components/posts/save'
import { QuicksaveLabel } from '@/components/posts/quicksave'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface WrapperProps {
    postId: string
    ownerUsername: string
    children: React.ReactNode
}

export const SavedPostWrapper = ({ postId, ownerUsername, children }: WrapperProps) => {
    // This should wrap posts when the user is viewing posts they have saved/created
    // Used in: A user viewing their own profile/folders
    return (
        <div className="group relative w-full">
            {children}
            <Link href={`/${ownerUsername}`}>
                <Button id="pin-username-label">
                    {ownerUsername}
                </Button>
            </Link>
            <div id="pin-save-label">
                <QuicksaveLabel disabled={true} postId={postId} />
                <SaveLabelComponent postId={postId} />
            </div>
        </div>
    )
}