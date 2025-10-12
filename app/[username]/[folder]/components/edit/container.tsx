"use client"
import { useState } from "react";
import { Info } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { FolderDetails } from "@/types/folders"
import { EditFolderForm } from "@/app/[username]/[folder]/components/edit/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

export const EditFolder = (
    { folder }: { folder: FolderDetails }
) => {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [open, setOpen] = useState(false);

    if (!isDesktop) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Info size={20} />
                </DrawerTrigger>
                <DrawerContent className="pb-32 pl-3">
                    <DrawerHeader hidden>
                        <DrawerTitle>Edit Folder</DrawerTitle>
                    </DrawerHeader>
                    <EditFolderForm folder={folder} />
                </DrawerContent>
            </Drawer >
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Info size={20} />
            </DialogTrigger>
            <DialogContent className="[&>button]:hidden">
                <DialogHeader hidden>
                    <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <EditFolderForm folder={folder} />
            </DialogContent >
        </Dialog >
    )
}
