import { useState } from "react"
import type { FolderSummary } from "@/types/folders"
import { FormContainer } from "@/app/(app)/[username]/[folder]/components/form-container"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
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
                    <ContextMenuItem className="text-xs">Share Link</ContextMenuItem>
                    {isOwner && <>
                        <ContextMenuItem className="text-xs" onClick={() => setOpen(true)}>
                            Edit Details
                        </ContextMenuItem>
                        <ContextMenuItem className="text-xs">Toggle Privacy</ContextMenuItem>
                        <ContextMenuItem variant="destructive" className="text-xs">Delete Folder</ContextMenuItem>
                    </>}
                </ContextMenuContent>
            </ContextMenu >
            {isOwner && <FormContainer folder={folder} open={open} setOpen={setOpen} />}
        </>
    )
}
