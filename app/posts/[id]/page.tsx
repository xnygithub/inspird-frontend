export default async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params

    return <p>You are viewing a post {id}</p>
}   