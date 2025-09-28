"use client"
import { useState } from "react"
import { quicksavePost } from "./actions"

interface QuicksaveLabelProps {
    postId: string
    disabled: boolean
}

export const QuicksaveLabel = ({ postId, disabled }: QuicksaveLabelProps) => {
    const [isSaved, setIsSaved] = useState(false)
    const handleQuicksave = () => {
        quicksavePost(postId).then(() => {
            setIsSaved(true)
        })
    }

    return (
        <button
            disabled={isSaved || disabled}
            onClick={handleQuicksave} >
            {isSaved ? "Saved" : "Save"}
        </button >
    )

}