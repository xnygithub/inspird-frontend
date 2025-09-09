export default async function UserFolderPage({ params }: {
    params: {
        username: string
        folder: string
    }
}) {
    const { folder } = await params

    return <p>You are viewing a folder {folder}</p>
}   