import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddImagesView } from "@/app/[username]/canvas/[canvas]/components/addImagesView";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from 'lucide-react';
import type { ProfilePostsType as Posts } from "@/types/posts";

interface Props {
    addPost: (post: Posts) => void;
}

export const AddImagesDialog = ({ addPost }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="icon">
                    <ImageIcon />
                    Add Images
                </Button>
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="min-w-[90vw] h-[90vh]" >
                <DialogHeader hidden>
                    <DialogTitle>Test</DialogTitle>
                </DialogHeader>
                <AddImagesView addPost={addPost} />
            </DialogContent>
        </Dialog>
    );
}
