// TODO: Address this, better way of handling this
export const getMediaUrl = (mediaUrl: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`
}

export const getFolderUrl = (folderUrl: string) => {
    if (!folderUrl) return null
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/folders/${folderUrl}`
}

export const getAvatarUrl = () =>
    // https://xtuvouuyblwehrqsmhqb.supabase.co/storage/v1/object/public/i/
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-avatars/`

export const getBannerUrl = () =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`



