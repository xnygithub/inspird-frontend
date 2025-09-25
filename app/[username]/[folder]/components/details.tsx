"use client"
import "@/app/[username]/[folder]/folder.css";
import { Folder } from "@/app/generated/prisma";
import { EditFolder } from "./edit";

export const FolderDetails = ({ folder }: { folder: Folder }) => {

    return (
        < >
            <div className="flex flex-row space-x-2">
                <h1 id="folder-name">{folder.name}</h1>
                <EditFolder folder={folder} />
            </div>
            {folder.description && <p id="folder-description">{folder.description}</p>}
        </ >
    )
}