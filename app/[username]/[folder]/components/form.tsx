"use client"
import "@/app/[username]/[folder]/folder.css";
import { editFolder } from "../actions";
import { Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { editFolderSchema, type EditFolderInput } from "@/lib/zod/folder.schema";
import { useParams } from "next/navigation";
import { deleteFolder } from "@/lib/queries/folders";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { FolderWithCounts } from "@/app/[username]/[folder]/types"

const supabase = createClient();

export const EditFolder = ({ folder }: { folder: FolderWithCounts }) => {
    const params = useParams<{ username: string; foldername: string }>();
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(editFolderSchema),
        defaultValues: {
            name: folder.name,
            description: folder.description || "",
            isPrivate: !!folder.isPrivate,
        },
    })

    const onSubmit = async (data: EditFolderInput) => {
        const { newSlug } = await editFolder(folder.id, data);
        if (newSlug) redirect(`/${params.username}/${newSlug}`);
    }

    const onDelete = async () => {
        const { error } = await deleteFolder(supabase, folder.id);
        if (!error) redirect(`/${params.username}`);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Info size={18} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} style={style}>
                    <input {...register("name")} placeholder="Folder name.." />
                    <p>{formState.errors.name?.message}</p>

                    <input {...register("description")} placeholder="Folder description.." />
                    <p>{formState.errors.description?.message}</p>

                    <input type="checkbox" {...register("isPrivate")} />
                    <p>{formState.errors.isPrivate?.message}</p>

                    <input type="submit" />
                </form>
                <button onClick={onDelete}>Delete Folder</button>
            </DialogContent>
        </Dialog>
    )
}

const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
}