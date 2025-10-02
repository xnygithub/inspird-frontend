import { Settings } from "@/components/settings/settings";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserProfile } from "../page";

interface Props {
    user: UserProfile;
}

export default function ProfileWithoutBanner({ user }: Props) {
    return (
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
    )
}