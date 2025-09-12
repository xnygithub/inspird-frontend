"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from 'usehooks-ts'
import { Avatar } from "@/components/layout/avatar";

interface SettingsProps {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export const Settings = ({ open, setOpen, trigger }: SettingsProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)')
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger &&
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            }
            <DialogContent className={` transition-none ${isMobile ? "min-w-full h-screen" : " min-w-[750px] h-[600px]"}`}>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <Avatar />
                {isMobile ? <p>Mobile</p> : <p>Desktop</p>}
            </DialogContent>
        </Dialog >
    )
}

