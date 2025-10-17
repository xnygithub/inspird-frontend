import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UsersPostLibrary from "@/app/[username]/canvas/[canvas]/components/library";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from 'lucide-react';

export default function AddPosts({ }) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon"> <ImageIcon className="w-4 h-4" /> </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="flex flex-col min-w-5/6 min-h-5/6 max-h-96 overflow-y-auto">
                <DialogHeader hidden>
                    <DialogTitle>Import</DialogTitle>
                </DialogHeader>
                <UsersPostLibrary />
            </DialogContent>
        </Dialog>
    );
}
