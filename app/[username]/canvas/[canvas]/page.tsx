import { notFound } from "next/navigation"
import { getCanvasDoc } from "@/lib/queries/canvas"
import { createClient } from "@/utils/supabase/server"
import { CanvasProvider } from "@/app/[username]/canvas/[canvas]/provider"
import CanvasPageComponent from "@/app/[username]/canvas/[canvas]/pages/canvas"
import type { CanvasDoc } from "@/app/[username]/canvas/[canvas]/types"

// Investiage suspse for canvas loading
// <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
//     <CanvasProvider canvas={doc}>
//         <CanvasPageComponent />
//     </CanvasProvider>
// </Suspense>

// TODO: Auto save canvas
// TODO: Display error if images are not loaded

export default async function CanvasPage({
    params
}: {
    params:
    Promise<{
        username: string;
        canvas: string
    }>
}) {
    const { canvas, username } = await params
    const supabase = await createClient()
    const { data, error } = await getCanvasDoc(supabase, username, canvas)
    if (error || !data) return notFound()

    return (
        <CanvasProvider canvas={data as CanvasDoc}>
            <CanvasPageComponent />
        </CanvasProvider>
    )
}   