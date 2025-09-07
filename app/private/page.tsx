import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'

export default async function PrivatePage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        redirect('/login')
    }

    return <>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <p>Hello {data.user.email}</p>
        <form action={signOut}>
            <button>Log out</button>
        </form>
    </>
}