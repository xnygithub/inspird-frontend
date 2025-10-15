"use client"
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useMediaQuery } from "usehooks-ts";
import { useIsMounted } from "@/hooks/mounted";
import { Button } from "@/components/ui/button";
import type { FolderWithCounts, FolderSummary } from "@/types/folders";
import { EditFolder as EditFolderForm } from "@/app/[username]/[folder]/components/edit/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

interface ContainerProps {
    folder: FolderWithCounts | FolderSummary
    open: boolean
    setOpen: (open: boolean) => void
}

export const FormContainer = (
    { folder, open, setOpen }: ContainerProps
) => {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const isMounted = useIsMounted()
    if (!isMounted) return null;

    if (!isDesktop) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="pb-32 pl-3">
                    <DrawerHeader hidden>
                        <DrawerTitle>Edit Folderss</DrawerTitle>
                    </DrawerHeader>
                    <EditFolderForm folder={folder} />
                </DrawerContent>
            </Drawer >
        )
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="[&>button]:hidden">
                <DialogHeader hidden>
                    <DialogTitle>Edit Folderss</DialogTitle>
                </DialogHeader>
                <EditFolderForm folder={folder} />
            </DialogContent >
        </Dialog >
    )
}

export const EditButton = (
    { folder }: { folder: FolderWithCounts }
) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(true)}
                className="rounded-full active:translate-y-0.5 cursor-pointer">
                <MdEdit />
            </Button>
            <FormContainer folder={folder} open={open} setOpen={setOpen} />
        </>
    )
}
