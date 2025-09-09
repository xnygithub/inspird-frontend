import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const supabase = await createClient()
    const token = await supabase.auth.getSession()

    const r = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${username}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.data.session?.access_token}`
        }
    })
    if (!r.ok) notFound()
    const rData = await r.json()

    return (
        <>
            <div className="relative w-10 h-10 overflow-hidden">
                <Image src={rData.user.avatar} alt="Avatar" fill className="object-cover" />
            </div>
            {rData.is_me ?
                <p>You are viewing your own profile</p>
                :
                <p>You are viewing another user&apos;s profile</p>
            }
        </>
    )
}   