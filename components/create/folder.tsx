"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createFolder } from "@/app/actions/folders";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { createFolderSchema, type CreateFolderInput } from "@/lib/zod/folder.schema";
// import { redirect } from "next/navigation";

interface CreateFolderProps {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}

export const CreateFolder = ({ setCreateOpen, createOpen }: CreateFolderProps) => {
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(createFolderSchema)
    })

    const onSubmit = async (data: CreateFolderInput) => {
        await createFolder(data);
        // const { newSlug } = await createFolder(data);
        // if (newSlug) redirect(`/${newSlug}`);
        setCreateOpen(false);
    }

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="bg-black text-white">
                <DialogTitle>Create Folder</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="folderName">Folder Name:</label>
                    <input  {...register("name")} placeholder="Folder name.." />
                    <p>{formState.errors.name?.message}</p>

                    <input type="submit" />
                </form>
            </DialogContent>
        </Dialog >
    );
};

