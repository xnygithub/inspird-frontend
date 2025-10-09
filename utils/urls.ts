// TODO: Address this, better way of handling this
export const getMediaUrl = (mediaUrl: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`
}

export const getFolderUrl = (folderUrl: string) => {
    if (!folderUrl) return null
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/folders/${folderUrl}`
}