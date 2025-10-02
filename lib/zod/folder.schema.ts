import { z } from "zod";

export const editFolderSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    isPrivate: z.boolean(),
});
export type EditFolderInput = z.infer<typeof editFolderSchema>;

export const createFolderSchema = z.object({
    name: z.string().min(1),
});
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
