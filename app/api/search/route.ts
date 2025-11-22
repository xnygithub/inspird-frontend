import { NextResponse, NextRequest } from 'next/server'
import { embedTextCached } from '@/lib/api/hf'
import { matchPosts } from '@/lib/queries/search';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { query } = await req.json()

    const embedding = await embedTextCached(query)
    if (!embedding) {
        return NextResponse.json("Failed perform search", { status: 500 })
    }
    const { data, error } = await matchPosts(supabase, embedding);
    return NextResponse.json({ data: data, error: error })
}