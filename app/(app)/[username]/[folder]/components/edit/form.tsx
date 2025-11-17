"use client"
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";

const supabase = createClient();

export const EditFolder = ({
    folder
}: {
    folder: FolderWithCounts | FolderSummary
}
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
        <form className="flex flex-col gap-3 py-2 font-sans" onSubmit={handleSubmit(onSubmit)}>
            <span className="block font-medium text-primary/90 text-lg text-center">Edit folder</span>
            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="folderName"
                    className="text-muted-foreground text-xs">
                    Folder name
                </Label>
                <Input
                    id="folderName"
                    {...register("name")}
                    name="name"
                    type="text"
                    autoComplete="off"
                    autoFocus={false}
                    placeholder="Enter a name for your folder"
                />
                <p>{formState.errors.name?.message}</p>
            </div>
            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="folderDescription"
                    className="text-muted-foreground text-xs">
                    Folder description
                </Label>
                <Textarea
                    id="folderDescription"
                    className="h-28 resize-none"
                    {...register("description")}
                    name="description"
                    autoComplete="off"
                    placeholder="Add a description for your folder"
                />
                <p>{formState.errors.description?.message}</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div >
                    <Label
                        htmlFor="isPrivate"
                        className="text-muted-foreground text-xs">
                        Folder visibility
                    </Label>
                    <p className="text-muted-foreground text-xs">Make your folder private to only you</p>
                </div>

                <Switch
                    id="isPrivate"
                    {...register("isPrivate")}
                    name="isPrivate"
                />
            </div>

            <p className="text-red-500">{formState.errors.isPrivate?.message}</p>
            <div className="flex justify-end items-center gap-2">
                <Button type="button" variant="destructive" onClick={onDelete}>Delete</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    )
}
