import './profile.css'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PinsContainer from '@/app/[username]/components/pin-tab'
import FoldersContainer from '@/app/[username]/components/folder-tab'
import { Settings } from '@/components/settings/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button'
import { Profile } from '@/app/generated/prisma/client'
import { getUserProfile } from '@/lib/queries/profile'
import CanvasContainer from './components/canvas-tab'
import { createClient } from '@/utils/supabase/server'
import ProfileWithBanner from './components/profile-with-banner'
import ProfileWithoutBanner from './components/profile-without-banner'

export interface UserProfile extends Profile {
    isMe: boolean;
    savedItemsCount: { count: number }[];
    foldersCount: { count: number }[];
    canvasDocCount: { count: number }[];
}

function getCount(count: { count: number }[]) {
    return count[0].count
}

export default async function UsernamePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const supabase = await createClient()
    const user = await getUserProfile(supabase, username)
    if (!user || user.profilePrivate && !user.isMe) return notFound()

    const bannerUrl = "https://t3.ftcdn.net/jpg/07/32/10/90/360_F_732109080_4lXwGofazqAiysUpcCnrbflsNOl9EMdW.jpg"

    return (
        <>
            {bannerUrl && user.isPro === "active" ?
                <ProfileWithBanner bannerUrl={bannerUrl} user={user} />
                :
                <ProfileWithoutBanner user={user} />
            }

            <Tabs id="profile-tabs-container" defaultValue="pins">
                <TabsList>
                    <TabsTrigger value="pins">
                        {getCount(user.savedItemsCount)} Pins
                    </TabsTrigger>
                    <TabsTrigger value="folders">
                        {getCount(user.foldersCount)} Folders
                    </TabsTrigger>
                    <TabsTrigger value="canvas">
                        {getCount(user.canvasDocCount)} Canvas
                    </TabsTrigger>
                </TabsList>
                <TabsContent id="tabs-content" value="pins" forceMount>
                    <PinsContainer userId={user.id} />
                </TabsContent>
                <TabsContent id="tabs-content" value="folders" forceMount>
                    <FoldersContainer userId={user.id} />
                </TabsContent>
                <TabsContent id="tabs-content" value="canvas" forceMount>
                    <CanvasContainer userId={user.id} />
                </TabsContent>
            </Tabs>
        </>
    )
}   