"use client"
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getMediaUrl } from "@/utils/urls";
import { Button } from "@/components/ui/button";
import { ProfilePostsType } from "@/types/posts";
import { Quicksave } from '@/components/posts/quicksave'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"


type ItemType = ProfilePostsType;

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

interface MasonryItemProps {
    index: number;
    data: ItemType;
    isMe: boolean;
}

export const MasonryItem = (
    { index, data, isMe }: MasonryItemProps
) => (
    <ContextMenuWrapper data={data} isMe={isMe}>
        <div className="group relative w-full" key={index}>
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
                <Link href={`/${data.ownerUsername}`}>
                    <Button variant="pinUsername" size="username">
                        @{data.ownerUsername}
                    </Button>
                </Link>
                <Quicksave isAlreadySaved={data.isSaved} postId={data.id} />
            </div>
        </div>
    </ContextMenuWrapper>
)



export const CanvasItem = ({
    index,
    data,
    selectedPosts,
    handleSelectPost
}: {
    index: number;
    data: ItemType;
    selectedPosts: ItemType[];
    handleSelectPost: (post: ItemType) => void;
}) => (
    <div className="relative" key={index} onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleSelectPost(data) }}>
        <div className={`${selectedPosts.includes(data) ? 'border-2 border-primary' : ''}`}>
            <Image
                className="object-cover"
                alt={data.mediaAltText || ''}
                src={getMediaUrl(data.mediaUrl)}
                width={data.mediaWidth}
                height={data.mediaHeight}
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    </div>
)