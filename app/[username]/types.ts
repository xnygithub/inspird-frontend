export interface FolderCardType {
    id: string
    slug: string
    name: string
    isPrivate: boolean
    lastUpdated: string
    ownerUsername: string
    postCount: number
    thumbnails: string[] | null
}