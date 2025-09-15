import { createUser } from '@/app/onboard/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Onboard() {

    // Simple safeguard for now
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const { data } = await supabase
        .from('profiles')
        .select('username, hasOnboarded')
        .eq('id', user?.id)
        .single()
    if (data?.hasOnboarded) redirect(`/${data.username}`)

    return (
        <form >
            <label htmlFor="username">Username:</label>
            <input id="username" name="username" type="text" required />
            <label htmlFor="displayName">Display Name:</label>
            <input id="displayName" name="displayName" type="text" required />
            <button formAction={createUser}>Create User</button>
        </form>
    )
}