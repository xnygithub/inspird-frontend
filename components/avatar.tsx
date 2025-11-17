"use client"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getUserId } from "@/lib/session"
import { Input } from "@/components/ui/input"
import { updateAvatar, uploadAvatar } from "@/lib/queries/profile"
import { useUserContext } from "./userContext"

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB


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
    const randomeKey = crypto.randomUUID().slice(0, 4)
    const key = `${userId}/${randomeKey}.${extension}`

    const { error: storageError } = await uploadAvatar(supabase, key, file)
    if (storageError) throw storageError
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-avatars/${key}`
}

export const handleUpdate = async (avatarUrl: string) => {
    const { supabase, userId } = await getUserId()
    if (!userId) throw new Error("No user session")
    const { error } = await updateAvatar(supabase, avatarUrl, userId)
    if (error) throw error
}

export const Avatar = ({
    url,
    className,
    props
}: {
    url: string
    className?: string
    props?: React.HTMLAttributes<HTMLDivElement>
}) => {
    const { user, updateUser } = useUserContext()
    const [avatarUrl] = useState<string>(user?.avatarUrl || url)
    const handleAvatarClick = () => {
        const doc = document.getElementById("avatar-input")
        if (doc) doc.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
            try {
                const newAvatarUrl = await handleUpload(file)
                await handleUpdate(newAvatarUrl)
                updateUser({ avatarUrl: newAvatarUrl })
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
        <div className={cn("space-y-2 md:max-w-xs", className)}>
            <div className="relative mx-auto rounded-full w-28 h-28 overflow-hidden">
                <Image
                    fill
                    {...props}
                    alt="Avatar"
                    src={avatarUrl}
                    className={cn("object-cover cursor-pointer")}
                    onClick={handleAvatarClick} />
                <Input
                    type="file"
                    id="avatar-input"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    hidden onChange={handleImageChange}
                />
            </div>
            <span className="block text-muted-foreground text-xs text-center">Click to change</span>
        </div>
    )
}