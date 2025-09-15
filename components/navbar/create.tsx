"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { CreateFolder } from "./create-folder"
import { UploadImage } from "./upload"
import { Button } from "../ui/button"
import { useState } from "react"

export const Create = () => {
    const [createOpen, setCreateOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>Create</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Button onClick={() => setCreateOpen(true)}>Create Folder</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button onClick={() => setUploadOpen(true)}>Upload Image</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {createOpen && <CreateFolder setCreateOpen={setCreateOpen} createOpen={createOpen} />}
            {uploadOpen && <UploadImage setUploadOpen={setUploadOpen} uploadOpen={uploadOpen} />}
        </>
    )
}
