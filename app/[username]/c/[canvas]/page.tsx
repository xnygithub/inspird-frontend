export default async function CanvasPage({ params }: { params: { canvas: string } }) {
    const { canvas } = await params
    return <div> {canvas} Canvas</div>
}