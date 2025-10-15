"use client"
import Image from 'next/image'
import gray from '@/public/gray.png'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FolderDropdown } from '@/types/folders'

interface Props {
    folder: FolderDropdown
    handleSave: (id: string) => void
    handleDelete: (id: string) => void
}

export const FolderItem = (
    { folder, handleSave, handleDelete }: Props
) => {
    // TODO: Show thumnail when available
    const [isSaved, setIsSaved] = useState(folder.containsPost)

    const handleClick = () => {
        if (isSaved) {
            handleDelete(folder.id)
            setIsSaved(false)
        } else {
            handleSave(folder.id)
            setIsSaved(true)
        }
    }

    return (
        <div id="folder-item-container" key={folder.id}>
            <div id="folder-item">
                <Image
                    width={50}
                    height={50}
                    className='object-cover aspect-square'
                    src={gray}
                    alt={"Folder Thumbnail"}
                />
                <div id="folder-item-name">
                    <p>{folder.name}</p>
                    <p>{folder.postCount} Items </p>
                    <p>{folder.isPrivate ? "(Private)" : "Public"}</p>
                </div>
            </div>
            <Button onClick={handleClick}>
                {isSaved ? "Delete" : "Save"}
            </Button>
        </div>

    )
}
