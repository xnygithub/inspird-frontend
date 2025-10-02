import { Settings } from "@/components/settings/settings";
import { UserProfile } from "../page";
import Image from "next/image";
import { Button } from "@/components/ui/button";


interface Props {
    bannerUrl: string;
    user: UserProfile;
}

export default function ProfileWithBanner({ bannerUrl, user }: Props) {
    return (
        <>
            <div id="banner-container">
                <div className="relative w-full h-60">
                    <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
                </div>
                <div id="banner-profile-avatar">
                    <Image
                        fill
                        alt="User Avatar"
                        src={user.avatarUrl}
                        className="object-cover"
                    />
                </div>
            </div>
            <div id="profile-container">
                <div id="profile-info">
                    <h2 className="font-bold text-[24px]">{user.displayName}</h2>
                    <h1 className="font-normal text-[16px]">@{user.username}</h1>
                </div>
                <div className="space-x-4">
                    {user.isMe && <Settings trigger={<Button>Settings</Button>} />}
                    {user.isMe && <Settings trigger={<Button>Edit Profile</Button>} />}
                </div>
            </div>
        </>
    )
}