"use client"
import { useState } from "react"
import { quickSavePost } from "@/lib/queries/posts"
import { createClient } from "@/utils/supabase/client"

interface QuicksaveLabelProps {
    postId: string
    disabled: boolean
}

export const QuicksaveLabel = ({ postId, disabled }: QuicksaveLabelProps) => {
    const [isSaved, setIsSaved] = useState(false)
    const supabase = createClient()
    const handleQuicksave = async () => {
        const { error } = await quickSavePost(supabase, postId)
        if (!error) {
            setIsSaved(true)
            return
        }
        console.error(error)
    }

    return (
        <button
            disabled={isSaved || disabled}
            onClick={handleQuicksave} >
            {isSaved ? "Saved" : "Save"}
        </button >
    )

}