import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Library from "@/app/[username]/canvas/[canvas]/components/library";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from 'lucide-react';
import { KonvaCanvasHandle } from "../features/KonvaCanvas";

interface Props {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}

export default function ImportPosts({ canvasRef }: Props) {
    const id = "f4bfd097-7b65-491f-9a9c-71e2f71c05c0"
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="icon"> <ImageIcon /> Add Posts</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="flex w-full min-w-5/6 min-h-5/6 max-h-96">
                <DialogHeader hidden>
                    <DialogTitle className="text-center">Add pins to your canvas</DialogTitle>
                </DialogHeader>
                <Library id={id} canvasRef={canvasRef} />
            </DialogContent>
        </Dialog>
    );
}
