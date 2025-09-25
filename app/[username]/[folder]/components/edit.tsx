"use client"
import "@/app/[username]/[folder]/folder.css";
import { editFolder } from "../actions";
import { Folder } from "@/app/generated/prisma";
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
import { folderSchema, type FolderInput } from "@/lib/zod/folder.schema";
import { useParams } from "next/navigation";


export const EditFolder = ({ folder }: { folder: Folder }) => {
    const params = useParams<{ username: string; foldername: string }>();
    const { register, handleSubmit, formState: { errors } }
        = useForm({
            resolver: zodResolver(folderSchema),
            defaultValues: {
                name: folder.name ?? "",
                description: folder.description ?? "",
                isPrivate: !!folder.isPrivate,
            },
        })
    const onSubmit = async (data: FolderInput) => {
        await editFolder(folder.id, params.username, data);
    }


    const onDelete = () => console.log("Delete folder")

    return (
        <Dialog>
            <DialogTrigger>
                <Info />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("name")} placeholder="Folder name.." />
                    <p>{errors.name?.message}</p>

                    <input {...register("description")} placeholder="Folder description.." />
                    <p>{errors.description?.message}</p>

                    <input type="checkbox" {...register("isPrivate")} />
                    <p>{errors.isPrivate?.message}</p>

                    <input type="submit" />
                </form>
                <button onClick={onDelete}>Delete Folder</button>
            </DialogContent>
        </Dialog>
    )
}