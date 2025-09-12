import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUserProfileByUsername } from '@/app/[username]/actions'
import PinsContainer from '@/app/[username]/_components/pins'
import FoldersContainer from '@/app/[username]/_components/folders'
import { Settings } from '@/components/layout/settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button'

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const user = await getUserProfileByUsername(username)

    if (!user || (user.private && !user.is_me)) return notFound()

    return (
        <>
            <div id="profile-container">
                <div id="profile-avatar">
                    <Image src={user.avatar_url} fill alt="User Avatar" className="object-cover" />
                </div>
                <div id="profile-info">
                    <h1>{user.username}</h1>
                    <h2>{user.display_name}</h2>
                </div>
                {user.is_me && <Settings trigger={<Button>Settings</Button>} />}
                <div id="profile-stats"> <p>{user.post_count} posts</p></div>
            </div >
            <Tabs id="profile-tabs-container" defaultValue="pins">
                <TabsList >
                    <TabsTrigger value="pins">Pins</TabsTrigger>
                    <TabsTrigger value="folders">Folders</TabsTrigger>
                </TabsList>
                <TabsContent id="tabs-content" value="pins" forceMount >
                    <PinsContainer user_id={user.id} />
                </TabsContent>
                <TabsContent id="tabs-content" value="folders" forceMount>
                    <FoldersContainer user_id={user.id} />
                </TabsContent>
            </Tabs>
        </>
    )
}   