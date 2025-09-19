import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetUsersPostsResult } from "@/lib/client/posts";
import Library from "./library";
import Explore from "./explore";
import "@/app/[username]/c/[canvas]/canvas.css";

interface ImportProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addPost: (post: GetUsersPostsResult["posts"][]) => void;
}

export default function Import({ open, onOpenChange, addPost }: ImportProps) {
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
                        <Library addPost={addPost} />
                    </TabsContent>
                    <TabsContent id="tabs-content" value="import" forceMount>
                        <Explore />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
