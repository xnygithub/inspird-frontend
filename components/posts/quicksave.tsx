"use client"
import { useState } from "react"
import { quicksavePost } from "@/components/posts/actions"

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