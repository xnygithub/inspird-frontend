"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from 'usehooks-ts'
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Profile } from "@/app/generated/prisma";
import SettingsDesktop from "@/components/settings/settings-desktop";
import SettingsMobile from "@/components/settings/settings-mobile";

interface SettingsProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export const Settings = ({ open, setOpen, trigger }: SettingsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [user, setUser] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = async () => {
        const supabase = createClient()
        const { data: user } = await supabase.auth.getUser()
        const { data: userData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.user?.id)
            .single()
        setUser(userData)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (isLoading) return <div>Loading...</div>
    if (!user) return <div>Error occured getting while fetching settings</div>
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger &&
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            }
            <DialogContent
                aria-describedby="Settings"
                className={`transition-none ${isMobile ? "min-w-full h-screen" : " min-w-[750px] h-[600px]"}`}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                {isMobile ? <SettingsMobile user={user} /> : <SettingsDesktop user={user} />}
            </DialogContent>
        </Dialog >
    )
}

