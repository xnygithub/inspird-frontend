import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Copy from "@/app/[username]/canvas/[canvas]/components/librarycopy";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from 'lucide-react';

export default function Test() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="icon">
                    <ImageIcon />
                    Add Image
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="min-w-[90vw] h-[90vh]" >
                <DialogHeader hidden>
                    <DialogTitle>Test</DialogTitle>
                </DialogHeader>
                <Copy />
            </DialogContent>
        </Dialog>
    );
}
