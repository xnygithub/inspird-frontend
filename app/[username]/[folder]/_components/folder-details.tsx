"use client"
import { Folder } from "@/app/generated/prisma";

export const FolderDetails = ({ folder }: { folder: Folder }) => {

    return (
        < >
            <p className='text-white text-6xl'>{folder.name}</p>
            {folder.description && <p className='mt-1 max-w-[40rem] text-sm'>{folder.description}</p>}
        </ >
    )
}