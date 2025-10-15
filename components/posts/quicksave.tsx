"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { quickSavePost } from "@/lib/queries/posts"
import { createClient } from "@/utils/supabase/client"

interface Props {
    isAlreadySaved: boolean
    postId: string
}

export const Quicksave = (
    { isAlreadySaved, postId }: Props
) => {
    const [isSaved, setIsSaved] = useState(isAlreadySaved)
    const supabase = createClient()

    const handleQuicksave = async () => {
        const { error } = await quickSavePost(supabase, postId)
        if (!error) setIsSaved(true)
    }

    return (
        <Button
            variant="savePin"
            disabled={isSaved}
            onClick={handleQuicksave} >
            {isSaved ? "Saved" : "Save"}
        </Button >
    )

}