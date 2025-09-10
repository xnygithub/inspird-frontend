import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getUserProfileByUsername } from '@/services/user'
import { Users } from '@/app/generated/prisma'
import PinsContainer from './_components/pins'

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params
    const user: Users = await getUserProfileByUsername(username)

    if (!user || user.private) return notFound()

    return (
        <div id="profile-container">
            <div id="profile-avatar">
                <Image
                    src={user.avatar_url}
                    fill
                    alt="User Avatar"
                    className="object-cover"
                />
            </div>
            <div id="profile-stats">
                {/* @ts-expect-error post_count and saved_items_count are not in the Users type */}
                <p>{user.post_count} posts</p>
                {/* @ts-expect-error saved_items_count is not in the Users type */}
                <p>{user.saved_items_count} saved items</p>
            </div>
            <PinsContainer user_id={user.id} />
        </div>
    )
}   