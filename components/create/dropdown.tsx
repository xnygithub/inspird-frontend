"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { CreateFolder } from "@/components/create/folder"
import { UploadImage } from "@/components/create/images"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CreateCanvas } from "@/components/create/canvas"
import { Import } from "@/components/create/import"
import { Folder, Image as ImageIcon, Brush, Upload } from "lucide-react"
import { useNavbarStore } from "../navbar/store"
import { cn } from "@/lib/utils"

export const Create = () => {
    const open = useNavbarStore((state) => state.open);
    const [folderOpen, setFolderOpen] = useState(false)
    const [uploadOpen, setUploadOpen] = useState(false)
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="genericRounded"
                        className={cn("font-sans font-medium text-sm", open ? "max-[925px]:hidden" : "block")}>
                        Create
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="px-0 py-1 rounded-xl w-44 min-w-44 font-sans text-base" sideOffset={20}>
                    <DropdownMenuItem asChild onClick={() => setFolderOpen(true)}>
                        <div className="flex flex-col items-start gap-2 py-2 cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                                <Folder size={16} /> New Folder
                            </div>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild onClick={() => setUploadOpen(true)}>
                        <div className="flex flex-col items-start gap-2 py-2 cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                                <ImageIcon size={16} /> New Image
                            </div>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild onClick={() => setCanvasOpen(true)}>
                        <div className="flex flex-col items-start gap-2 py-2 cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                                <Brush size={16} /> New Canvas
                            </div>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild onClick={() => setImportOpen(true)}>
                        <div className="flex flex-col items-start gap-2 py-2 cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                                <Upload size={16} /> Import Content
                            </div>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            {folderOpen && <CreateFolder setCreateOpen={setFolderOpen} createOpen={folderOpen} />
            }
            {uploadOpen && <UploadImage setUploadOpen={setUploadOpen} uploadOpen={uploadOpen} />}
            {canvasOpen && <CreateCanvas setCreateOpen={setCanvasOpen} createOpen={canvasOpen} />}
            {importOpen && <Import setCreateOpen={setImportOpen} createOpen={importOpen} />}
        </>
    )
}
