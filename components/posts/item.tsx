"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import gray from '@/public/gray.png'

interface itemProps {
    folder: any
    handleSave: (id: string) => void
    handleDelete: (id: string) => void
}

export const Item = ({ folder, handleSave, handleDelete }: itemProps) => {
    const [isSaved, setIsSaved] = useState(folder.is_saved[0].count !== 0)

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
                    src={folder.thumbnail || gray}
                    alt={"Folder Thumbnail"}
                />
                <div id="folder-item-name">
                    <p>{folder.name}</p>
                    <p>{folder.total_posts[0].count} Items </p>
                    <p>{folder.isPrivate ? "(Private)" : "Public"}</p>
                </div>
            </div>
            <Button onClick={handleSaveClick}>{isSaved ? "Delete" : "Save"}</Button>
        </div>
    )
}
