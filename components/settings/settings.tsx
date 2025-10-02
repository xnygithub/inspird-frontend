"use client"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from 'usehooks-ts'
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getUserSettings } from "@/lib/queries/profile";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import MobileContainer from "./views/mobile";
import DesktopContainer from "./views/desktop";

interface SettingsProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

const supabase = createClient()
export const Settings = ({ open, setOpen, trigger }: SettingsProps) => {
    const [session, setSession] = useState<Session | null>(null)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const getSession = async () => {
        const { data: session, error } = await supabase.auth.getSession()
        if (!error) setSession(session.session)
    }

    useEffect(() => void getSession(), [])

    const { isValidating, data } = useQuery(
        getUserSettings(supabase, session?.user.id as string), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );

    if (isValidating) return <div>Loading...</div>
    if (!data) return <div>Error occured getting while fetching settings</div>
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger &&
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            }
            <DialogContent
                aria-describedby="Settings"
                className={`transition-none  
                    ${isMobile ?
                        "min-w-full min-h-[100svh] max-h-[100svh] flex flex-col p-0 "
                        :
                        "min-w-[750px] h-[600px] px-40 p-0"}`}>
                {isMobile ?
                    <MobileContainer data={data} />
                    :
                    <DesktopContainer data={data} />}
            </DialogContent>
        </Dialog >
    )
}

