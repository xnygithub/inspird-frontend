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
import { useUserContext } from "../userContext";

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
    const { user } = useUserContext()
    const { open, closeSettings } = useSettingsModal();
    const isMobile = useMediaQuery('(max-width: 768px)')
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
                {user &&
                    isMobile ?
                    <MobileContainer data={user} />
                    :
                    <DesktopContainer data={user} />
                }
            </DialogContent>
        </Dialog >
    )
}

