import { EditButton } from "@/app/[username]/[folder]/components/edit/container";
import { FolderNav } from "@/app/[username]/[folder]/components/nav";
import type { FolderWithCounts } from "@/types/folders";

interface Props {
    folder: FolderWithCounts
    canEdit: boolean
}

export const FolderDetails = (
    { folder, canEdit }: Props
) => {
    const totalCount = Object
        .values(folder.mediaCounts)
        .reduce((acc, item) => acc + item, 0);

    return (
        <div className="flex flex-col">
            <FolderNav username={folder.ownerUsername} slug={folder.slug} />
            <div className="inline-flex items-center gap-2">
                <h1>{folder.name}</h1>
                {canEdit && <EditButton folder={folder} />}
            </div>
            {folder.description && <h2>{folder.description}</h2>}
            <div className="space-x-2">
                <span>{totalCount} Posts</span>
                {Object.entries(folder.mediaCounts).map(([type, count]) => (
                    <span key={type}>{count} {type}{count !== 1 ? 's' : ''}</span>
                ))}
            </div>
            <div className="space-x-2">
                <span>Created {new Date(folder.createdAt).toLocaleDateString()}</span>
                <span>Updated {new Date(folder.lastUpdated).toLocaleDateString()}</span>
            </div>
        </div>
    )
}