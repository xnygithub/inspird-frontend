"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createCanvas } from "@/app/actions/canvas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

export const CreateCanvas = ({
    setCreateOpen,
    createOpen
}: {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}) => {
    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent showCloseButton={false} className="bg-popover rounded-xl w-md max-w-md font-sans text-white">
                <DialogTitle hidden>Create Canvas Form</DialogTitle>
                <form action={createCanvas} className="flex flex-col gap-2">
                    <div className="flex flex-col items-center gap-1 mb-8 text-center">
                        <h1 className="font-semibold text-2xl">New canvas</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Let&apos;s start visualizing your ideas.
                        </p>
                    </div>
                    <Label
                        htmlFor="canvasTitle"
                        className="pl-1 text-muted-foreground text-xs">
                        Canvas title
                    </Label>
                    <Input
                        id="canvasTitle"
                        name="canvasTitle"
                        type="text"
                        required
                        className="px-4 border-0 rounded-xl ring-0 focus-visible:ring-0 w-[100%] text-primary text-sm placeholder:text-sm" />
                    <Button type="submit" className="mt-2">Create Canvas</Button>
                </form>
            </DialogContent>
        </Dialog >
    );
};

