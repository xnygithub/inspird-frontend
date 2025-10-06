"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { CreateFolder } from "@/components/create/folder"
import { UploadImage } from "@/components/create/images"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CreateCanvas } from "@/components/create/canvas"
import { Import } from "@/components/create/import"

export const Create = () => {
    const [folderOpen, setFolderOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
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
                    <DropdownMenuItem onClick={() => setImportOpen(true)}>
                        Import Pinterest
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {folderOpen && <CreateFolder setCreateOpen={setFolderOpen} createOpen={folderOpen} />}
            {uploadOpen && <UploadImage setUploadOpen={setUploadOpen} uploadOpen={uploadOpen} />}
            {canvasOpen && <CreateCanvas setCreateOpen={setCanvasOpen} createOpen={canvasOpen} />}
            {importOpen && <Import setCreateOpen={setImportOpen} createOpen={importOpen} />}
        </>
    )
}
