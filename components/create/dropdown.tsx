"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { CreateFolder } from "./folder"
import { UploadImage } from "./images"
import { Button } from "../ui/button"
import { useState } from "react"
import { CreateCanvas } from "./canvas"

export const Create = () => {
    const [folderOpen, setFolderOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const [canvasOpen, setCanvasOpen] = useState(false)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Create</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFolderOpen(true)}>
                        Create Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUploadOpen(true)}>
                        Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCanvasOpen(true)}>
                        Create Canvas
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {folderOpen && <CreateFolder setCreateOpen={setFolderOpen} createOpen={folderOpen} />}
            {uploadOpen && <UploadImage setUploadOpen={setUploadOpen} uploadOpen={uploadOpen} />}
            {canvasOpen && <CreateCanvas setCreateOpen={setCanvasOpen} createOpen={canvasOpen} />}
        </>
    )
}
