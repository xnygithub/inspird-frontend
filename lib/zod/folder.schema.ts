import { z } from "zod";
export const folderSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    isPrivate: z.boolean(),
});
export type FolderInput = z.infer<typeof folderSchema>;