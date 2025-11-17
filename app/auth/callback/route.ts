// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const next = url.searchParams.get('next') || '/';

    const supabase = await createClient();

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            url.pathname = '/error';
            url.searchParams.set('message', error.message);
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.redirect(new URL(next, url.origin));
}
