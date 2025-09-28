"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from 'usehooks-ts'
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getUserSettings } from "@/lib/queries/profile";

interface SettingsProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

const supabase = createClient()
export const Settings = ({ open, setOpen, trigger }: SettingsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)')

    const { isValidating, data } = useQuery(
        getUserSettings(supabase, "8c5aeb07-61d3-4022-941e-aac964e58a43"),
        { revalidateOnFocus: false, revalidateOnReconnect: false }
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
                className={`transition-none ${isMobile ? "min-w-full h-screen" : " min-w-[750px] h-[600px]"}`}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    <p>{isMobile ? "Mobile" : "Desktop"}</p>
                </>
            </DialogContent>
        </Dialog >
    )
}

