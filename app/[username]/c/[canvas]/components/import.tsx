import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersPostLibrary from "@/app/[username]/c/[canvas]/components/library";
import Explore from "@/app/[username]/c/[canvas]/components/explore";
import "@/app/[username]/c/[canvas]/canvas.css";
import { AddPostProps } from "@/types/canvas";

interface ImportProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addPost: (post: AddPostProps["post"][]) => void;
}

export default function AddPostsDialog({ userId, open, onOpenChange, addPost }: ImportProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col min-w-5/6 min-h-5/6">
                <DialogHeader>
                    <DialogTitle>Import</DialogTitle>
                </DialogHeader>
                <Tabs id="tabs-container" defaultValue="library" >
                    <TabsList>
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="import">Import</TabsTrigger>
                    </TabsList>
                    <TabsContent id="tabs-content" value="library" forceMount>
                        <UsersPostLibrary userId={userId} addPost={addPost} />
                    </TabsContent>
                    <TabsContent id="tabs-content" value="import" forceMount>
                        <Explore />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
