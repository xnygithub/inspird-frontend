import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const next = searchParams.get('next') ?? '/'
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')

    const supabase = await createClient()

    try {
        if (code) {
            // New flow: ConfirmationURL → exchange code for a session
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) throw error
            return redirect(next)
        }

        if (token_hash && type) {
            // Legacy/manual flow: verify token_hash yourself
            const { error } = await supabase.auth.verifyOtp({ type, token_hash })
            if (error) throw error
            return redirect(next)
        }
    } catch (e) {
        console.error('Auth confirm error:', e)
    }

    // If nothing matched or something failed:
    return redirect('/error')
}