"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createCanvas } from "@/app/[username]/c/[canvas]/actions";

interface CreateCanvasProps {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}
export const CreateCanvas = ({ setCreateOpen, createOpen }: CreateCanvasProps) => {
    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="bg-black text-white">
                <DialogTitle>Create Canvas</DialogTitle>
                <form action={createCanvas}>
                    <label htmlFor="canvasTitle">Canvas Title:</label>
                    <input id="canvasTitle" name="canvasTitle" type="text" required />
                    <button type="submit">Create Canvas</button>
                </form>
            </DialogContent>
        </Dialog >
    );
};

