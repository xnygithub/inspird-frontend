import './profile.css'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PinsContainer from '@/app/[username]/components/pin-tab'
import FoldersContainer from '@/app/[username]/components/folder-tab'
import { Settings } from '@/components/settings/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button'
import { Profile } from '@/app/generated/prisma/client'
import { getUserProfileByUsername } from '@/lib/server/profile'
import CanvasContainer from './components/canvas-tab'

export interface UserProfile extends Profile {
    postCount: number;
    folderCount: number;
    isMe: boolean;
}


export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const user: UserProfile = await getUserProfileByUsername(username)
    if (!user || (user.profilePrivate && !user.isMe)) return notFound()

    return (
        <>
            <div id="profile-container">
                <div id="profile-avatar">
                    <Image
                        src={user.avatarUrl}
                        fill
                        alt="User Avatar"
                        className="object-cover"
                    />
                </div>
                <div id="profile-info">
                    <h1>{user.username}</h1>
                    <h2>{user.displayName}</h2>
                </div>
                {user.isMe && <Settings trigger={<Button>Settings</Button>} />}
                <div id="profile-stats">
                    <p>{user.postCount} posts</p>
                    <p>{user.folderCount} folders</p>
                </div>
            </div >
            <Tabs id="profile-tabs-container" defaultValue="pins">
                <TabsList >
                    <TabsTrigger value="pins">Pins</TabsTrigger>
                    <TabsTrigger value="folders">Folders</TabsTrigger>
                    <TabsTrigger value="canvas">Canvas</TabsTrigger>
                </TabsList>
                <TabsContent id="tabs-content" value="pins" forceMount >
                    <PinsContainer user={user} />
                </TabsContent>
                <TabsContent id="tabs-content" value="folders" forceMount>
                    <FoldersContainer user={user} />
                </TabsContent>
                <TabsContent id="tabs-content" value="canvas" forceMount>
                    <CanvasContainer user={user} />
                </TabsContent>
            </Tabs>
        </>
    )
}   