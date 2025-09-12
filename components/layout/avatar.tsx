"use client"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export const Avatar = () => {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    useEffect(() => {
        const fetchUser = async () => {
            const { data: user } = await supabase.auth.getUser()
            setUser(user.user)
            setAvatarURL(user.user?.user_metadata.avatarURL)
        }
        fetchUser()
    }, [])
    const [avatarURL, setAvatarURL] = useState<string>()
    console.log(user)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarURL(URL.createObjectURL(file))
        }
    }
    return (
        <>
            <img
                src={avatarURL}
                alt="Avatar"
                className="rounded-full w-20 h-20 object-cover"
                onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.onchange = (e: unknown) => handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
                    input.click()
                }}
            />
        </>
    )
}
