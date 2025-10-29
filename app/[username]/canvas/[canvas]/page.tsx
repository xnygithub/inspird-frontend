import Canvas from "@/app/[username]/canvas/[canvas]/features/page"
import { createClient } from '@/utils/supabase/server'

async function loadCanvas(title: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("canvas_doc")
        .select("*")
        .eq("title", title)
        .single()
    if (error) throw new Error(error.message)
    return data
}

interface Props {
    params: Promise<{ canvas: string }>
}
export default async function CanvasPage({ params }: Props) {
    const { canvas } = await params
    const data = await loadCanvas(canvas)
    console.log(data)
    return <Canvas data={data} />
}