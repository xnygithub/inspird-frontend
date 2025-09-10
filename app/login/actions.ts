'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const creds = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data, error } = await supabase.auth.signInWithPassword(creds)
    if (error) redirect('/error')

    // const r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${data.session?.access_token}`
    //     }
    // })
    // if (!r.ok) redirect('/error')
    // const rData = await r.json()

    const { data: responseData, error: resposneError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_sub", data.user?.id)
        .single();

    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            id: responseData.id,
            username: responseData.username,
            displayName: responseData.displayName,
            avatarURL: responseData.avatar,
        }
    })

    console.log(updateError)
    if (updateError) redirect('/error')

    revalidatePath('/', 'layout')
    redirect(`/${responseData.username}`)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const creds = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(creds)

    if (error) redirect('/error')
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) {
        redirect('/error')
    }
    redirect('/')
}