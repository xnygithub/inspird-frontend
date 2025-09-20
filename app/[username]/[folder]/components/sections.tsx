"use client"
import { Folder, FolderSection } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createSection } from "@/app/actions/folders";

interface SectionsProps {
    folder: Folder & { folder_sections: FolderSection[] };
}

export const Sections = ({ folder }: SectionsProps) => {
    console.log(folder)
    return (
        <div className="flex gap-5 w-full overflow-x-auto scrollbar-hide">
            <div className="space-x-5 overflow-hidden">
                {folder.folder_sections.map((section: FolderSection) => (
                    <span key={section.id}>{section.name}</span>
                ))}
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create section</Button>
                </DialogTrigger>
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Create new section</DialogTitle>
                    </DialogHeader>
                    <form action={createSection.bind(null, folder.id)}
                        className="flex flex-col gap-2">
                        <label htmlFor="sectionName">Section name:</label>
                        <input id="sectionName" name="sectionName" required />
                        <Button type="submit">Create section</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
};