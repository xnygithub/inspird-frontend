import CanvasPageComponent from "./pages/canvas"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getCanvasDoc } from "@/lib/queries/canvas"

interface Props {
    params: Promise<{ username: string; canvas: string }>;
}

export default async function CanvasPage(
    { params }: Props
) {
    const { canvas, username } = await params
    const supabase = await createClient()
    const { data, error } = await getCanvasDoc(supabase, username, canvas)
    if (error || !data) return notFound()
    return <CanvasPageComponent canvas={data} />
}   