import { Folder } from "../generated/prisma";

export interface FolderCardType extends Folder {
    owner: { username: string }
}