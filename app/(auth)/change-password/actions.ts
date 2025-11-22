'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') return 'https://your-production-url.com'
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export async function resetPassword(
    initialState: { message: string },
    formData: FormData
) {
    const email = formData.get('email') as string
    const supabase = await createClient()
    const baseUrl = getBaseUrl()
    const redirectTo = `${baseUrl}/auth/callback?next=/change-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) return { error: true, message: error.message }
    return { message: 'Please check your email for a reset password link.' }
}

export async function updatePassword(
    initialState: { message: string },
    formData: FormData
) {
    const newPassword = formData.get('new-password') as string
    const confirmNewPassword = formData.get('confirm-new-password') as string
    if (newPassword !== confirmNewPassword) return { error: true, message: 'Passwords do not match.' }
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: true, message: error.message }
    redirect('/login')
}