// TODO: Address this, better way of handling this
export const getMediaUrl = (mediaUrl: string) => {
    if (!mediaUrl) return null
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/i/${mediaUrl}`
}