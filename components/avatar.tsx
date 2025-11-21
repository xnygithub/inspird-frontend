"use client"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getUserId } from "@/lib/session"
import { Input } from "@/components/ui/input"
import { removeStorage, updateAvatar, uploadStorage } from "@/lib/queries/profile"
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

    const bucket = "u"
    const ext = file.name.split(".").pop()
    const uuid = crypto.randomUUID()
    const key = `${userId}/${uuid}.${ext}`

    const { error } = await uploadStorage(supabase, bucket, key, file)

    if (error) throw error
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`
}

export const handleUpdate = async (
    oldKey: string,
    newKey: string
) => {
    const { supabase, userId } = await getUserId()

    if (!userId) throw new Error("No user session")
    const { error } = await updateAvatar(supabase, newKey, userId)
    if (error) throw error

    const { error: deleteError } = await removeStorage(supabase, "u", oldKey)
    if (deleteError) throw deleteError

}

export const Avatar = ({
    url,
}: {
    url: string
}) => {
    const { user, updateUser } = useUserContext()
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || url)

    const handleAvatarClick = () => {
        const doc = document.getElementById("avatar-input")
        if (doc) doc.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
            try {
                const oldKey = avatarUrl.split("/u/")[1]
                const newKey = await handleUpload(file)
                await handleUpdate(oldKey, newKey)
                updateUser({ avatarUrl: newKey })
                setAvatarUrl(newKey)
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
        <div className="space-y space-y-2 md:max-w-xs">
            <div className="relative mx-auto rounded-full w-28 h-28 overflow-hidden">
                <Image
                    fill
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