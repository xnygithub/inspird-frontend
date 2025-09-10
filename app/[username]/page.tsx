import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUserProfileByUsername } from '@/services/user'
import PinsContainer from './_components/pins'
import FoldersContainer from './_components/folders'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const user = await getUserProfileByUsername(username)

    if (!user || (user.private && !user.is_me)) return notFound()

    return (
        <div id="profile-container">
            <div id="profile-avatar">
                <Image src={user.avatar_url} fill alt="User Avatar" className="object-cover" />
            </div>
            <div id="profile-stats"> <p>{user.post_count} posts</p></div>
            <Tabs defaultValue="pins">
                <div id="profile-tabs">
                    <TabsList>
                        <TabsTrigger value="pins">Pins</TabsTrigger>
                        <TabsTrigger value="folders">Folders</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent id="tabs-content" value="pins" forceMount >
                    <PinsContainer user_id={user.id} />
                </TabsContent>
                <TabsContent id="tabs-content" value="folders" forceMount>
                    <FoldersContainer user_id={user.id} />
                </TabsContent>
            </Tabs>
        </div >
    )
}   