"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createFolder } from "@/app/actions/folders";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { createFolderSchema, type CreateFolderInput } from "@/lib/zod/folder.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
// import { redirect } from "next/navigation";


export const CreateFolder = ({
    setCreateOpen,
    createOpen
}: {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}) => {

    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(createFolderSchema)
    })

    const onSubmit = async (data: CreateFolderInput) => {
        await createFolder(data);
        // const { newSlug } = await createFolder(data);
        // if (newSlug) redirect(`/${newSlug}`);
        setCreateOpen(false);
    }

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent showCloseButton={false} className="bg-popover rounded-xl w-md max-w-md font-sans text-white transition-all duration-200">
                <DialogTitle hidden>Create Folder</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center gap-1 mb-8 text-center">
                        <h1 className="font-semibold text-2xl">New folder</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Let&apos;s start organizing your images.
                        </p>
                    </div>

                    <div className="flex flex-row items-end gap-4">
                        <div className="flex flex-col gap-1 w-full">
                            <Label
                                htmlFor="folderName"
                                className="pl-1 text-muted-foreground text-xs">
                                Folder name
                            </Label>
                            <Input
                                id="folderName"
                                {...register("name")}
                                name="name"
                                className="px-4 border-0 rounded-xl ring-0 focus-visible:ring-0 w-[100%] text-primary text-sm placeholder:text-sm"
                                placeholder="fashion-ideas"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="icon"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <ChevronDown
                                size={20}
                                className={cn(isOpen ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200")}
                            />
                        </Button>
                    </div>
                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300",
                            isOpen ? "max-h-40 opacity-100 mt-5" : "max-h-0 opacity-0"
                        )}
                    >
                        <div className="flex flex-col gap-1 w-full">
                            <Label
                                htmlFor="folderDescription"
                                className="pl-1 text-muted-foreground text-xs">
                                Folder description
                            </Label>
                            <Textarea
                                id="folderDescription"
                                name="description"
                                className="px-4 py-3 border-0 rounded-xl ring-0 focus-visible:ring-0 w-full h-28 text-primary placeholder:text-md text-sm resize-none no-scrollbar"
                                placeholder="This folder is for fashion ideas"
                                tabIndex={isOpen ? 0 : -1}
                                aria-hidden={!isOpen}
                                disabled={!isOpen}
                            />
                        </div>
                    </div>

                    <span className="text-red-500">{formState.errors.name?.message}</span>

                    {/* <Button type="submit">Create Folder</Button> */}
                </form>
            </DialogContent>
        </Dialog >
    );
};