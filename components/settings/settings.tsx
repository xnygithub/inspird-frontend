"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaQuery } from 'usehooks-ts'
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getUserSettings } from "@/lib/queries/profile";
import { useEffect, useRef, useState } from "react";
import { Session } from "@supabase/supabase-js";
import MobileContainer from "./views/mobile";
import DesktopContainer from "./views/desktop";
import { useSettingsModal } from "@/app/context/settings-modal";

const supabase = createClient()

export const Loading = () => {
    return (
        <>
            <DialogHeader hidden>
                <DialogTitle >Settings</DialogTitle>
            </DialogHeader>
            <p>Loading...</p>
        </>
    )
}

export const NoData = () => {
    return (
        <>
            <DialogHeader hidden>
                <DialogTitle >Settings</DialogTitle>
            </DialogHeader>
            <p>Error occured getting while fetching settings</p>
        </>
    )
}


export const Settings = () => {
    const { open, closeSettings } = useSettingsModal();
    const [session, setSession] = useState<Session | null>(null)
    const isMobile = useMediaQuery('(max-width: 768px)')
    const getSession = async () => {
        const { data: session, error } = await supabase.auth.getSession()
        if (!error) setSession(session.session)
    }

    useEffect(() => {
        void getSession()
    }, [])

    const { isValidating, data } = useQuery(
        session?.user?.id ?
            getUserSettings(supabase, session.user.id)
            :
            null, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    }
    );
    const userDismiss = useRef(false);

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) { userDismiss.current = true; closeSettings(); } }}>
            <DialogContent
                aria-describedby="Settings"
                className={`transition-none  
                    ${isMobile ?
                        "min-w-full min-h-[100svh] max-h-[100svh] flex flex-col p-0 "
                        :
                        "min-w-[750px] h-[600px] px-40 p-0"}`}>
                {isValidating ?
                    <Loading />
                    :
                    !data ?
                        <NoData />
                        :
                        isMobile ?
                            <MobileContainer data={data} />
                            :
                            <DesktopContainer data={data} />
                }
            </DialogContent>
        </Dialog >
    )
}

