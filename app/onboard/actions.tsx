'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function onboard(formData: FormData) {
    const supabase = await createClient()
    const token = await supabase.auth.getSession()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const username = formData.get('username') as string

    // Function/API call to set the username would go here
    // Example:
    // const r = await fetch(`backend-api...`, {
    //     ...
    //     'Authorization': `Bearer ${token.data.session?.access_token}`
    // })

    revalidatePath('/', 'layout')
    redirect(`/${username}`)
}