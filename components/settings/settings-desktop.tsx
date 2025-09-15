import { Profile } from '@/app/generated/prisma'
import Image from 'next/image'

export const SettingsDesktop = ({ user }: { user: Profile }) => {
    return (
        <>
            <div className="relative rounded-full w-20 h-20 overflow-hidden">
                <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
            </div>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p>Desktop</p>
        </>
    )
}

export default SettingsDesktop