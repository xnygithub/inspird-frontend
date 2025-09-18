'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
    const username = formData.get('username') as string
    const displayName = formData.get('displayName') as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/error')

    const { error } = await supabase
        .from('profiles')
        .insert({
            id: user.id as string,
            email: user.email as string,
            username,
            displayName,
            hasOnboarded: true,
        })

    if (error) redirect('/error')

    await supabase.auth.updateUser({
        data: {
            hasOnboarded: true,
        },
    })

    revalidatePath('/', 'layout')
    redirect(`/${username}`)
}
