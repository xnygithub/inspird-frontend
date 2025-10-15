import { ContextMenuItem } from "@/components/ui/context-menu"

export const OpenNewTab = ({ postId }: { postId: string }) => {
    return (
        <ContextMenuItem
            onClick={() => window.open(`/posts/${postId}`, "_blank")}>
            Open in new tab
        </ContextMenuItem>
    )
}

export const CopyLink = ({ postId }: { postId: string }) => {
    return (
        <ContextMenuItem onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
        }}>
            Copy link
        </ContextMenuItem>
    )
}

export const OpenImageNewTab = ({ mediaUrl }: { mediaUrl: string }) => {
    return (
        <ContextMenuItem onClick={() => {
            window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`, "_blank")
        }}>
            View image
        </ContextMenuItem>
    )
}