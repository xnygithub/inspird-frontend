import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SettingsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const Settings = ({ open, setOpen }: SettingsProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Settings</DialogTitle>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}