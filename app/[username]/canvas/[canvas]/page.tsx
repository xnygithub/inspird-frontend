import Canvas from "@/app/[username]/canvas/[canvas]/features/page"
import { createClient } from '@/utils/supabase/server'

export default async function CanvasPage({ params }: {
    params: Promise<{ canvas: string }>
}) {
    const supabase = await createClient()

    const { canvas } = await params;
    const { data, error } = await supabase
        .from("canvas_doc")
        .select("*")
        .eq("slug", canvas)
        .single()
    if (error) throw new Error(error.message)
    return <Canvas data={data} />
}