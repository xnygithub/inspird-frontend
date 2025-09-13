"use client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createFolder } from "@/app/[username]/[folder]/actions";

export const CreateFolder = () => {
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button>Create Folder</Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white">
                <DialogTitle>Create Folder</DialogTitle>
                <form action={createFolder}>
                    <label htmlFor="folderName">Folder Name:</label>
                    <input id="folderName" name="folderName" type="text" required />
                    <button type="submit">Create Folder</button>
                </form>
            </DialogContent>
        </Dialog >
    );
};

