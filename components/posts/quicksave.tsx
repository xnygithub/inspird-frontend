"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
        < Button
            disabled={isSaved || disabled}
            onClick={handleQuicksave} >
            {isSaved ? "Saved" : "Save"}
        </Button >
    )

}