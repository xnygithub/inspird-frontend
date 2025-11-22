"use client"
import { useState } from "react"
import { CreateFolder } from "@/components/create/folder"
import { Button } from "@/components/ui/button"

export const NoUserFolders = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex flex-col justify-center items-center mt-auto h-full">
            <span>No folders found. Lets create one!</span>
            <Button
                variant="genericRounded"
                onClick={() => setOpen(true)}>
                Create Folder
            </Button>
            <CreateFolder setCreateOpen={setOpen} createOpen={open} />
        </div>
    )
}

export const NoFoldersOrPrivate = () => {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <span>This user has no folders or all of their folders are private</span>
        </div>
    )
}