import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/utils/urls";
import { Quicksave } from '@/components/posts/quicksave'
import { Button } from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"


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


const ContextMenuWrapper = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { children, data }: { children: React.ReactNode, data: any }
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
                <ContextMenuItem variant="destructive">Report</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}


export const MasonryItem = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { index, data }: { index: number, data: any }
) => (
    <ContextMenuWrapper data={data}>
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