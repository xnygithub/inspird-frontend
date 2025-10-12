"use client"
import { editFolder } from "@/app/actions/folders";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { editFolderSchema, type EditFolderInput } from "@/lib/zod/folder.schema";
import { useParams } from "next/navigation";
import { deleteFolder } from "@/lib/queries/folders";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { FolderDetails } from "@/types/folders"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "usehooks-ts";

const supabase = createClient();

export const EditFolderForm = (
    { folder }: { folder: FolderDetails }
) => {
    const isDesktop = useMediaQuery("(min-width: 768px)")
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

    if (!isDesktop) {
        return (
            <>
                <h1 className="opacity-60 font-semibold text-lg text-center">Edit Folder</h1>
                <form style={style} className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
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
                </form>
            </>
        )
    }

    return (
        <>
            <h1 className="opacity-60 font-semibold text-lg text-center">Edit Folder</h1>
            <form
                style={style}
                className="space-y-1"
                onSubmit={handleSubmit(onSubmit)}>
                <>
                    <Label>Folder name</Label>
                    <Input {...register("name")} placeholder="Folder name.." />
                    <p>{formState.errors.name?.message}</p>
                </>

                <>
                    <Label>Folder description</Label>
                    <Textarea
                        className="w-full h-28 resize-none"
                        {...register("description")}
                        placeholder="Folder description.." />
                    <p>{formState.errors.description?.message}</p>
                </>
                <>
                    <Label>Private</Label>
                    <Input type="checkbox" {...register("isPrivate")} />
                    <p className="text-red-500">{formState.errors.isPrivate?.message}</p>
                </>
                <Button type="submit">Save</Button>
            </form>
            <Button
                type="button"
                variant="destructive"
                onClick={onDelete}>
                Delete Folder
            </Button>
        </>
    )
}

const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
}