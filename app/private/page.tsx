import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/login/actions'

export default async function PrivatePage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    const token = await supabase.auth.getSession()

    if (error || !data?.user) {
        redirect('/login')
    }

    return <>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(token, null, 2)}</pre> */}
        <p>{process.env.NEXT_PUBLIC_ENV}</p>
        <p>Hello {data.user.email}</p>
        <form action={signOut}>
            <button>Log out</button>
        </form>
    </>
}