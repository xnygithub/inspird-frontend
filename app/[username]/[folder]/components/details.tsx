"use client"
import "@/app/[username]/[folder]/folder.css";
import { Folder } from "@/app/generated/prisma";

export const FolderDetails = ({ folder }: { folder: Folder }) => {

    return (
        < >
            <h1 id="folder-name">{folder.name}</h1>
            {folder.description && <p id="folder-description">{folder.description}</p>}
        </ >
    )
}