import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

async function saveCanvas(
    supabase: SupabaseClient,
    //@ts-expect-error: Json is not defined
    jsonData: Json,
    canvasDocId: string
) {
    const { data, error } = await supabase
        .from("canvas_doc")
        .update({ data: jsonData })
        .eq("id", canvasDocId)
    if (error) throw new Error(error.message)
    return data
}

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    const { data, canvasDocId } = await req.json()
    const savedData = await saveCanvas(supabase, data, canvasDocId)
    return NextResponse.json({ success: true, data: savedData })
}