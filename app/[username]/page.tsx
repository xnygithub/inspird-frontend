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
                    <h2 className="font-bold text-[24px]">{user.displayName}</h2>
                    <h1 className="font-normal text-[16px]">@{user.username}</h1>
                </div>
                <div className="space-x-4">
                    {user.isMe && <Settings trigger={<Button>Settings</Button>} />}
                    {user.isMe && <Settings trigger={<Button>Edit Profile</Button>} />}
                </div>
            </div >
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