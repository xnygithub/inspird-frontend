"use client"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { getUserId } from "@/lib/session"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { uploadStorage } from "@/lib/queries/storage"
import { Database } from "@/database.types"
import { SupabaseClient } from "@supabase/supabase-js"

const TYPES = ["image/jpeg", "image/png"]
const MAX_SIZE = 5

/**
 * Validate an image file against allowed MIME types and a maximum size.
 *
 * @param file - The image file to validate.
 * @param size - Optional max file size in megabytes. If not provided, default is 5MB.
 * @returns true if the file type is allowed and the size is within the limit,
 *          otherwise false.
 */
function validateImage(
    file: File,
    size: number = MAX_SIZE
) {
    const maxSize = size * 1024 * 1024
    return TYPES.includes(file.type) && file.size <= maxSize
}

async function handleUpload(
    file: File,
    folderId: string
) {
    const { supabase, userId } = await getUserId()
    if (!userId) throw new Error("No user session")

    const bucket = "u"
    const extension = file.name.split(".").pop()
    const randomeKey = crypto.randomUUID().slice(0, 8)
    const key = `${userId}/f/${randomeKey}.${extension}`

    const error = await uploadStorage(supabase, bucket, key, file)
    if (error) throw error
    const fullKey = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`


    const dbError = await updateFolderThumbnail(supabase, folderId, fullKey)
    if (dbError) throw dbError
}

async function updateFolderThumbnail(
    client: SupabaseClient<Database>,
    folderId: string,
    key: string
) {
    const { error } = await client
        .from("folders")
        .update({ thumbnail: key })
        .eq("id", folderId)
    return error
}



export const EditThumbnail = ({
    folderId,
    url,
}: {
    folderId: string,
    url: string
}) => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(url)

    function handleThumbnailClick() {
        const doc = document.getElementById("thumbnail-input")
        if (doc) doc.click()
    }

    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file && validateImage(file)) {
            try {
                await handleUpload(file, folderId)
                const obj = URL.createObjectURL(file)
                setThumbnailUrl(obj)
                toast.success("Thumbnail updated")
            } catch (error) {
                toast.error("Failed to update thumbnail")
                console.error(error)
            } finally {
                e.target.value = ""
            }
        }
    }

    return (
        <div className="w-full">
            <div className="relative mx-auto rounded-md w-48 aspect-square overflow-hidden">
                {thumbnailUrl ? (<Image
                    fill
                    alt="Thumbnail"
                    src={thumbnailUrl}
                    className="object-cover cursor-pointer"
                    onClick={handleThumbnailClick} />
                ) : (
                    <div
                        className="flex justify-center items-center bg-gray-900 w-full h-full"
                        onClick={handleThumbnailClick}>
                        <PlusIcon className="w-6 h-6" />
                    </div>
                )}
                <Input
                    type="file"
                    tabIndex={0}
                    id="thumbnail-input"
                    accept={TYPES.join(",")}
                    hidden onChange={handleImageChange}
                />
            </div>
            {/* <span className="block text-muted-foreground text-xs text-center">Click to edit</span> */}
        </div>
    )
}