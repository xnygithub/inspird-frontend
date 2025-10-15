"use client"
import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { uploadAvatar } from "@/lib/queries/profile"
import { getUserId } from "@/lib/session"
import { toast } from "sonner"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

interface Props {
    url: string
    className: string
    props?: React.HTMLAttributes<HTMLDivElement>
    canEdit: boolean
}

const validateImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return false
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return false
    }
    return true
}


const handleUpload = async (file: File) => {
    const { supabase, userId } = await getUserId()
    if (!userId) throw new Error("No user session")

    const extension = file.name.split(".").pop()
    const key = `${userId}.${extension}`

    const { error: storageError } = await uploadAvatar(supabase, key, file)
    if (storageError) throw storageError
}

export const Avatar = (
    { url, className, props, canEdit }: Props
) => {
    const [avatarUrl] = useState<string>(url)
    const handleAvatarClick = () => {
        if (!canEdit) return
        const doc = document.getElementById("avatar-input")
        if (doc) doc.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canEdit) return
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
            try {
                await handleUpload(file)
                toast.success("Avatar updated")
            } catch (error) {
                toast.error("Failed to update avatar")
                console.error(error)
            } finally {
                e.target.value = ""
            }
        }
    }

    return (
        <>
            <Image
                fill
                src={avatarUrl}
                alt="Avatar"
                className={cn(canEdit ? "cursor-pointer" : "", className)}
                {...props}
                onClick={canEdit ? handleAvatarClick : undefined} />
            {canEdit &&
                <Input
                    type="file"
                    id="avatar-input"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    hidden onChange={handleImageChange}
                />}
        </>
    )
}