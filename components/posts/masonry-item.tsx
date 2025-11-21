"use client"
import Link from "next/link";
import Image from "next/image";
import { useState } from "react"
import { toast } from "sonner";
import { getMediaUrl } from "@/utils/urls";
import { Button } from "@/components/ui/button"
import { quickSavePost } from "@/lib/queries/posts"
import { createClient } from "@/utils/supabase/client"
import { FolderPostsType, ProfilePostsType } from "@/types/posts";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"



type ItemType = ProfilePostsType | FolderPostsType;

function OpenNewTab({
    postId
}: {
    postId: string
}
) {
    return (
        <ContextMenuItem
            onClick={() => window.open(`/posts/${postId}`, "_blank")}>
            Open in new tab
        </ContextMenuItem>
    )
}

function CopyLink({
    postId
}: {
    postId: string
}
) {
    return (
        <ContextMenuItem onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
        }}>
            Copy link
        </ContextMenuItem>
    )
}

function OpenImageNewTab({
    mediaUrl
}: {
    mediaUrl: string
}
) {
    return (
        <ContextMenuItem onClick={() => {
            window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`, "_blank")
        }}>
            View image
        </ContextMenuItem>
    )
}

function DeletePost({
    postId }: { postId: string }
) {
    async function handleDelete() {
        toast.success(`Post ${postId} deleted`)
        // const supabase = createClient()
        // const { error } = await deletePost(supabase, postId)
        // if (error) {
        //     console.log("Error deleting post", error.message)
        // } else {
        //     toast.success("Post deleted ")
        // }
    }
    return (
        <ContextMenuItem
            variant="destructive"
            onClick={handleDelete}>
            Delete
        </ContextMenuItem>
    )
}

function Quicksave({
    isAlreadySaved,
    postId
}: {
    isAlreadySaved: boolean
    postId: string
}) {
    const [isSaved, setIsSaved] = useState(isAlreadySaved)
    const supabase = createClient()

    async function handleQuicksave() {
        const { error } = await quickSavePost(supabase, postId)
        if (!error) setIsSaved(true)
    }

    return (
        <Button
            variant="savePin"
            disabled={isSaved}
            onClick={handleQuicksave} >
            {isSaved ? "Saved" : "Save"}
        </Button >
    )
}
function ContextMenuWrapper({
    children,
    data,
    isMe
}: {
    children: React.ReactNode;
    data: ItemType;
    isMe: boolean;
}
) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <OpenNewTab postId={data.id} />
                <OpenImageNewTab mediaUrl={data.mediaUrl} />
                <CopyLink postId={data.id} />
                <ContextMenuSeparator />
                {isMe && <DeletePost postId={data.id} />}
                <ContextMenuItem variant="destructive">Report</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}



export const MasonryItem = ({
    data,
    isMe
}: {
    data: ItemType;
    isMe: boolean
}
) => {
    return (
        <ContextMenuWrapper data={data} isMe={isMe}>
            <div className="group relative w-full overflow-hidden squircle">
                <Link href={`/posts/${data.id}`}>
                    <img
                        className="hover:brightness-70 object-cover hover:scale-105 transition-all duration-300"
                        alt={data.mediaAltText || ''}
                        src={getMediaUrl(data.mediaUrl)}
                        width={data.mediaWidth}
                        height={data.mediaHeight}
                        loading="lazy"
                        fetchPriority="low"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Link>
                <div id="group-hover">
                    {/* <Link
                        href={`/${data.ownerUsername}`}
                        className={cn(
                            "inline-flex right-[.5rem] bottom-[.5rem] absolute p-0 px-3 py-1.5",
                            "bg-[var(--background)] text-[var(--primary)] font-medium font-sans text-xs rounded-full",
                            "hover:underline hover:underline-offset-4 space-x-0.5")}>
                        @{data.ownerUsername}
                    </Link> */}
                    <Quicksave isAlreadySaved={data.isSaved} postId={data.id} />
                </div>
            </div>
        </ContextMenuWrapper>
    )
}
