import '@/app/[username]/profile.css'
import { notFound } from 'next/navigation'
import { getProfileRPC } from '@/lib/queries/profile'
import { createClient } from '@/utils/supabase/server'
import Container from '@/app/[username]/components/container';
import ProfileCard from '@/app/[username]/components/profile';
import NavTransparencyController from '@/app/[username]/components/navbar-contoller';

export default async function ProfilePage(
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()
    const { data: currentUser } = await supabase.auth.getUser()
    const { data, error } = await getProfileRPC(supabase, username)

    if (error || !data) return notFound()

    const isMe = currentUser.user?.id === data?.id
    const isPrivate = data.profilePrivate && !isMe

    let showBanner = false
    if (!!data.bannerUrl && data.isPro === "active")
        showBanner = true

    return (
        <div className={`${showBanner ? "" : "padding-top"}`}>
            <NavTransparencyController showBanner={showBanner} />
            <ProfileCard user={data} isMe={isMe} showBanner={showBanner} />
            {isPrivate ? <div>Private Profile</div> : <Container user={data} isMe={isMe} />}
        </div>
    )
}   