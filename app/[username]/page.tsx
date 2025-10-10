import './profile.css'
import { notFound } from 'next/navigation'
import PinsContainer from '@/app/[username]/components/pin-tab'
import FoldersContainer from '@/app/[username]/components/folder-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from '@/app/generated/prisma/client'
import { getUserProfile } from '@/lib/queries/profile'
import CanvasContainer from './components/canvas-tab'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image';
import UserSettings from './components/user-settings';

export interface UserProfile
    extends Omit<
        Profile,
        'hasOnboarded' |
        'subscriptionId' |
        'stripeCustomerId' |
        'subscriptionStatus'
    > {
    isPro: boolean;
    isMe: boolean;
    savedItemsCount: { count: number }[];
    foldersCount: { count: number }[];
    canvasDocCount: { count: number }[];
}

export default async function UsernamePage(
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params
    const supabase = await createClient()
    const user = await getUserProfile(supabase, username)
    if (!user || user.profilePrivate && !user.isMe) return notFound()


    return (
        <>
            <div id="profile-container">
                <div id="profile-avatar">
                    <Image
                        sizes="160px"
                        fill
                        alt="User Avatar"
                        src={user.avatarUrl}
                        className="object-cover"
                    />
                </div>
                <div id="profile-info">
                    <h2 className="font-semibold text-[24px]">{user.displayName}</h2>
                    <h1 className="opacity-80 font-normal text-[16px]">@{user.username}</h1>
                </div>
                {user.isMe && <UserSettings />}
            </div >

            <Tabs id="profile-tabs-container" defaultValue="pins">
                <TabsList>
                    <TabsTrigger value="pins">
                        {user.savedItemsCount[0].count} Pins
                    </TabsTrigger>
                    <TabsTrigger value="folders">
                        {user.foldersCount[0].count} Folders
                    </TabsTrigger>
                    <TabsTrigger value="canvas">
                        {user.canvasDocCount[0].count} Canvas
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