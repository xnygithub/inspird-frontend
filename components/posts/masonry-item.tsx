"use client"
import Link from "next/link";
import { useMemo, useState } from "react"
import { getMediaUrl } from "@/utils/urls";
import { Button } from "@/components/ui/button"
import { quickSavePost } from "@/lib/queries/posts"
import { createClient } from "@/utils/supabase/client"
import { FolderPostsType, ProfilePostsType, SimilarPost } from "@/types/posts";
import PostContextMenu from "./context-menu";

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


type UserMasonryItemProps = {
    data: ProfilePostsType | FolderPostsType;
    isMe: boolean;
}

/**
 * A Masonry item for the user's profile. This will be displayed
 * in places such as the users profile page, folders etc.
 * @param data - The post data
 * @param isMe - Whether the user is the owner of the post. Used to show the delete button.
 * @returns A Masonry item for the user's profile
 */
export const UserMasonryItem = ({
    data,
    isMe
}: UserMasonryItemProps) => {
    return (
        <PostContextMenu data={data} isMe={isMe}>
            <div className="group relative w-full overflow-hidden squircle">
                <Link href={`/posts/${data.id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
        </PostContextMenu>
    )
}

export function FeedMasonryItem({ data }: { data: SimilarPost }) {

    const mediaUrl = useMemo(() => {
        return getMediaUrl(data.mediaUrl)
    }, [data.mediaUrl])

    return (
        <PostContextMenu data={data} isMe={false}>
            <div className="group relative w-full overflow-hidden squircle">
                <Link href={`/posts/${data.id}`}>
                    {/* We use <img/> here to prevent next/Image 
                    caching but we can revert to next/Image component later. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="hover:brightness-70 object-cover hover:scale-105 transition-all duration-300"
                        alt={data.mediaAltText || ''}
                        src={mediaUrl}
                        width={data.mediaWidth}
                        height={data.mediaHeight}
                        loading="lazy"
                        fetchPriority="low"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Link>
                <div id="group-hover">
                    {/* TODO: Implement quicksave */}
                    <Quicksave isAlreadySaved={false} postId={data.id} />
                </div>
            </div>
        </PostContextMenu>
    )
}