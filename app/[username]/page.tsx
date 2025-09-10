import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUserProfileByUsername } from '@/services/user'
import { createClient } from '@/utils/supabase/server'
import { Users } from '@/app/generated/prisma'
import PinsContainer from './_components/pins'

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const user: Users = await getUserProfileByUsername(username)

    if (!user || user.private) return notFound()

    const supabase = await createClient()
    const currentUser = await supabase.auth.getUser()
    const is_me = user.auth_sub === currentUser.data.user?.id


    return (
        <>
            <div className="relative w-10 h-10 overflow-hidden">
                <Image alt="Avatar" fill className="object-cover" src={user.avatar_url} />
            </div>
            <p>You are viewing {is_me ? "your own" : "another user's"} profile</p>
            <PinsContainer user_id={user.id} limit={1} initialOffset={0} />
        </>
    )
}   