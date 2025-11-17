"use client"
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getMediaUrl } from "@/utils/urls";
import { cn } from "@/lib/utils";
import { FolderPostsType, ProfilePostsType } from "@/types/posts";
import { Quicksave } from '@/components/posts/quicksave'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

type ItemType = ProfilePostsType | FolderPostsType;

const OpenNewTab = (
    { postId }: { postId: string }
) => {
    return (
        <ContextMenuItem
            onClick={() => window.open(`/posts/${postId}`, "_blank")}>
            Open in new tab
        </ContextMenuItem>
    )
}

const CopyLink = (
    { postId }: { postId: string }
) => {
    return (
        <ContextMenuItem onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
        }}>
            Copy link
        </ContextMenuItem>
    )
}

const OpenImageNewTab = (
    { mediaUrl }: { mediaUrl: string }
) => {
    return (
        <ContextMenuItem onClick={() => {
            window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`, "_blank")
        }}>
            View image
        </ContextMenuItem>
    )
}

const DeletePost = (
    { postId }: { postId: string }
) => {
    const handleDelete = async () => {
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


interface CtxProps {
    children: React.ReactNode;
    data: ItemType;
    isMe: boolean;
}

const ContextMenuWrapper = (
    { children, data, isMe }: CtxProps
) => {
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
            <div className="group relative w-full overflow-hidden">
                <Link href={`/posts/${data.id}`}>
                    <Image
                        className="object-cover"
                        alt={data.mediaAltText || ''}
                        src={getMediaUrl(data.mediaUrl)}
                        width={data.mediaWidth}
                        height={data.mediaHeight}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Link>
                <div id="group-hover">
                    <Link
                        href={`/${data.ownerUsername}`}
                        className={cn(
                            "inline-flex right-[.5rem] bottom-[.5rem] absolute p-0 px-3 py-1.5",
                            "bg-[var(--background)] text-[var(--primary)] font-medium font-sans text-xs rounded-full",
                            "hover:underline hover:underline-offset-4 space-x-0.5")}>
                        @{data.ownerUsername}
                    </Link>
                    <Quicksave isAlreadySaved={data.isSaved} postId={data.id} />
                </div>
            </div>
        </ContextMenuWrapper>
    )
}
