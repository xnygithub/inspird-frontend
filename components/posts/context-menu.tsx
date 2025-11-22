import { useCallback } from "react"
import { toast } from "sonner";
import { ProfilePostsType, FolderPostsType, SimilarPost } from "@/types/posts";
import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuSeparator
} from "@/components/ui/context-menu"

type ItemType = ProfilePostsType | FolderPostsType | SimilarPost;

function OpenNewTab({ postId }: { postId: string }) {
    return (
        <ContextMenuItem
            onClick={() => window.open(`/posts/${postId}`, "_blank")}>
            Open in new tab
        </ContextMenuItem>
    )
}

function CopyLink({ postId }: { postId: string }) {
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
        toast.success("Link copied")
    }, [postId])

    return (
        <ContextMenuItem onClick={handleCopy}>
            Copy link
        </ContextMenuItem>)
}

function OpenImageNewTab({ mediaUrl }: { mediaUrl: string }) {
    return (
        <ContextMenuItem onClick={() => {
            window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`, "_blank")
        }}>
            View image
        </ContextMenuItem>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ReportPost({ postId }: { postId: string }) {
    return (
        <ContextMenuItem variant="destructive">Report</ContextMenuItem>
    )
}

function DeletePost({ postId }: { postId: string }) {
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


type PostContextMenuProps = {
    children: React.ReactNode;
    data: ItemType;
    isMe: boolean;
}

export default function PostContextMenu({
    children,
    data,
    isMe
}: PostContextMenuProps) {
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
                <ReportPost postId={data.id} />
            </ContextMenuContent>
        </ContextMenu>
    )
}