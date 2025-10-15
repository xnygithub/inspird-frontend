"use client"
import Image from "next/image";
import { useState } from "react";
import { RawUser } from "@/types/users";

interface Props {
    user: RawUser;
}

export default function Avatar({ user }: Props) {
    const [avatar, setAvatar] = useState<string>(user.avatarUrl);

    const handleAvatarClick = () => {
        const avatarInput = document.getElementById("avatar-settings");
        if (avatarInput) {
            avatarInput.click();
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    }

    return (
        <>
            <div
                className="relative mx-auto rounded-full w-28 h-28 overflow-hidden cursor-pointer"
                onClick={handleAvatarClick}
            >
                <Image src={avatar} alt="avatar" fill className="object-cover" />
            </div>
            <input
                id="avatar-settings"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
            />
        </ >
    )
}