import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SettingsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const Settings = ({ open, setOpen }: SettingsProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-sm:m-0 max-md:m-0 max-md:w-full max-md:h-full">
                <DialogTitle>Settings</DialogTitle>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}