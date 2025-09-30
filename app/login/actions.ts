'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
}

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) redirect('/error')
    revalidatePath('/', 'layout')
    redirect(`/`)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const baseUrl = getBaseUrl()
    const emailRedirectTo = `${baseUrl}/auth/confirm?next=/`
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase
        .auth.signUp({
            email,
            password,
            options: { emailRedirectTo }
        })

    if (error) redirect('/error')
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) redirect('/error')
    redirect('/')
}