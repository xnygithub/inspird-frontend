"use client"
import "@/app/[username]/[folder]/folder.css";
import { FolderDetails as FolderDetailsType } from "@/app/[username]/[folder]/types";
import { EditFolder } from "@/app/[username]/[folder]/components/edit";

export const FolderDetails = ({ folder }: { folder: FolderDetailsType }) => {
    const totalCount = folder.mediaCount.reduce(
        (acc: number, item: { count: number }) => acc + item.count, 0);
    const byType = Object.fromEntries(folder.mediaCount.map(r => [r.media_type, r.count]));

    return (
        <>
            <div className="flex flex-row space-x-2">
                <h1 id="folder-name">{folder.name}</h1>
                <EditFolder folder={folder} />
            </div>
            {folder.description && <p id="folder-description">{folder.description}</p>}
            <div className="flex flex-row space-x-2">
                <p>{totalCount} Posts</p>
                <p>{byType.image} images</p>
                <p>{byType.video} videos</p>
                <p>{byType.gif} gifs</p>
            </div>
            <p>Created {new Date(folder.createdAt).toLocaleDateString()}</p>
            <p>Updated {new Date(folder.updatedAt).toLocaleDateString()}</p>
        </>
    )
}