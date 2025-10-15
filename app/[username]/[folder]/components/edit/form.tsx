"use client"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import "@/app/[username]/[folder]/folder.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { editFolder } from "@/app/actions/folders";
import { FolderWithCounts, FolderSummary } from "@/types/folders";
import { Textarea } from "@/components/ui/textarea";
import { deleteFolder } from "@/lib/queries/folders";
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from "@/utils/supabase/client";
import { editFolderSchema, type EditFolderInput } from "@/lib/zod/folder.schema";

const supabase = createClient();

export const EditFolder = (
    { folder }: { folder: FolderWithCounts | FolderSummary }
) => {
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
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Label>Folder name</Label>
            <Input {...register("name")} placeholder="Folder name.." />
            <p>{formState.errors.name?.message}</p>
            <Label>Folder description</Label>
            <Textarea
                className="w-full h-28 resize-none"
                {...register("description")}
                placeholder="Folder description.." />
            <p>{formState.errors.description?.message}</p>
            <Label>Private</Label>
            <Input type="checkbox" {...register("isPrivate")} />
            <p className="text-red-500">{formState.errors.isPrivate?.message}</p>
            <Button type="submit">Save</Button>
            <Button type="button" variant="destructive" onClick={onDelete}>Delete</Button>
        </form>
    )
}
