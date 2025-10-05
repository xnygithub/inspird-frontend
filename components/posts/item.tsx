"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import gray from '@/public/gray.png'
import { FolderDropdown as FolderDropdownType } from '@/types/folders'

interface itemProps {
    folder: FolderDropdownType
    handleSave: (id: string) => void
    handleDelete: (id: string) => void
}

export const Item = ({ folder, handleSave, handleDelete }: itemProps) => {
    const [isSaved, setIsSaved] = useState(folder.containsPost)

    const handleSaveClick = () => {
        if (isSaved) {
            handleDelete(folder.id)
            setIsSaved(false)
        } else {
            handleSave(folder.id)
            setIsSaved(true)
        }
    }

    return (
        <div id="folder-item-container" >
            <div id="folder-item">
                <Image
                    width={50}
                    height={50}
                    className='object-cover aspect-square'
                    src={folder.thumbnail || gray}
                    alt={"Folder Thumbnail"}
                />
                <div id="folder-item-name">
                    <p>{folder.name}</p>
                    <p>{folder.postCount} Items </p>
                    <p>{folder.isPrivate ? "(Private)" : "Public"}</p>
                </div>
            </div>
            <Button onClick={handleSaveClick}>{isSaved ? "Delete" : "Save"}</Button>
        </div>
    )
}
