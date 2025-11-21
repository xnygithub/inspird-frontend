import '@/app/(app)/[username]/profile.css'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Container from '@/app/(app)/[username]/components/container';
import ProfileCard from '@/app/(app)/[username]/components/profile';
import NavTransparencyController from '@/app/(app)/[username]/components/navbar-contoller';
import { ProfileProvider } from '@/app/(app)/[username]/components/provider';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { UserProfile } from '@/types/users';
import PrivatePage from '@/app/(app)/[username]/components/private-page';

async function getProfile(
    client: SupabaseClient<Database>,
    username: string
): Promise<UserProfile | null> {
    const { data, error } = await client.rpc(
        "get_profile", {
        p_username: username
    }).maybeSingle();

    if (error || !data) return null
    return data
}


export default async function ProfilePage(
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()
    const { data: currentUser } = await supabase.auth.getUser()
    const user = await getProfile(supabase, username)

    if (!user) return notFound()

    const isMe = currentUser.user?.id === user.id
    const isPrivate = user.profilePrivate && !isMe

    let showBanner = false
    if (user.bannerUrl && user.isPro === "active")
        showBanner = true

    return (
        <div className={`${showBanner ? "" : "padding-top"}`}>
            <NavTransparencyController showBanner={showBanner} />
            <ProfileProvider user={user} isMe={isMe}>
                <ProfileCard user={user} isMe={isMe} showBanner={showBanner} />
                {isPrivate ? <PrivatePage /> : <Container />}
            </ProfileProvider>
        </div >

    )
}   