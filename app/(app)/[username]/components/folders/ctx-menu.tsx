import { useState } from "react"
import type { FolderSummary } from "@/types/folders"
import { FormContainer } from "@/app/(app)/[username]/[folder]/components/edit/container"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu"


interface Props {
    children: React.ReactNode
    folder: FolderSummary
    isOwner: boolean
}

export const FolderContextMenuWrapper = (
    { children, folder, isOwner }: Props
) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Share Link</ContextMenuItem>
                    {isOwner && <>
                        <ContextMenuItem onClick={() => setOpen(true)}>
                            Edit Details
                        </ContextMenuItem>
                        <ContextMenuItem>Toggle Privacy</ContextMenuItem>
                        <ContextMenuItem variant="destructive">Delete Folder</ContextMenuItem>
                    </>}
                </ContextMenuContent>
            </ContextMenu >
            {isOwner && <FormContainer folder={folder} open={open} setOpen={setOpen} />}
        </>
    )
}
