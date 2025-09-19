import { getCanvas } from "./actions"
import CanvasPageComponent from "./pages/canvas"
import { notFound } from "next/navigation"

export default async function CanvasPage({ params }: { params: { canvas: string } }) {
    const { canvas } = await params
    const canvasDoc = await getCanvas(canvas)
    if (!canvasDoc) return notFound()
    return <CanvasPageComponent canvas={canvasDoc} />
}   