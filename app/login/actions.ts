'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AuthError } from '@supabase/supabase-js'
//TODO: Find all the errors that can occur when authenticating

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
}

function getSignInErrorMessage(error: AuthError) {
    console.log(error)
    if (error.message.includes('Email not confirmed'))
        return "Please confirm your email"

    if (error.message.includes('Invalid login credentials'))
        return "Email or password is incorrect"

    return "An error occurred"
}

function getSignUpErrorMessage(error: AuthError) {
    if (error.message.includes('Email already in use'))
        return "Email already in use"
    if (error.message.includes('Password should be at least 6 characters'))
        return "Password should be at least 6 characters"
    return "An error occurred"
}

export async function login(
    initialState: { message: string },
    formData: FormData
) {
    const supabase = await createClient()
    const creds = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const { error } = await supabase.auth.signInWithPassword(creds)
    if (error) return { error: true, message: getSignInErrorMessage(error) }
    redirect('/')
}

export async function signup(
    initialState: { message: string },
    formData: FormData
) {
    const supabase = await createClient()
    const baseUrl = getBaseUrl()
    const emailRedirectTo = `${baseUrl}/auth/confirm?next=/`
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp(
        { email, password, options: { emailRedirectTo } })

    if (error) return { error: true, message: getSignUpErrorMessage(error) }

    return { message: 'Please check your email for a confirmation link.' }
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) redirect('/error')
    redirect('/')
}

export async function resetPassword(
    initialState: { message: string },
    formData: FormData
) {
    const email = formData.get('email') as string
    const supabase = await createClient()
    const baseUrl = getBaseUrl()
    const redirectTo = `${baseUrl}/change-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) return { error: true, message: error.message }
    return { message: 'Please check your email for a reset password link.' }
}