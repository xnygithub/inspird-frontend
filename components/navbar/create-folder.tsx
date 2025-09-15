"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createFolder } from "@/app/[username]/[folder]/actions";

interface CreateFolderProps {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}
export const CreateFolder = ({ setCreateOpen, createOpen }: CreateFolderProps) => {
    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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

