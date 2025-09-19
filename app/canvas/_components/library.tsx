import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LibraryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function Library({ open, onOpenChange }: LibraryProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Library</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
