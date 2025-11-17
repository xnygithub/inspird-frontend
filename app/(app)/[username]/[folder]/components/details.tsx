import type { FolderWithCounts } from "@/types/folders";
import { EditButton } from "@/app/(app)/[username]/[folder]/components/edit/container";
import { FolderNav } from "@/app/(app)/[username]/[folder]/components/nav";

export const FolderDetails = ({
    folder,
    canEdit
}: {
    folder: FolderWithCounts
    canEdit: boolean
}) => {
    const totalCount = Object
        .values(folder.mediaCounts)
        .reduce((acc, item) => acc + item, 0);

    const createdAt = new Date(folder.createdAt).toLocaleDateString("en-US", { year: "2-digit", month: "short", day: "numeric" });
    const updatedAt = new Date(folder.lastUpdated).toLocaleDateString("en-US", { year: "2-digit", month: "short", day: "numeric" });

    return (
        <div className="flex flex-col max-w-2xl font-sans text-primary">
            <FolderNav username={folder.ownerUsername} slug={folder.slug} />
            <h1 className="inline-flex items-center gap-2 mt-4 font-semibold text-4xl">
                {folder.name} {canEdit && <EditButton folder={folder} />}
            </h1>

            {folder.description && <h2 className="text-muted-foreground">{folder.description}</h2>}
            <div className="space-x-2 mt-3 text-muted-foreground text-sm">
                <span>{totalCount} Posts</span>
                {Object.entries(folder.mediaCounts).map(([type, count]) => (
                    <span key={type}>{count} {type}{count !== 1 ? 's' : ''}</span>
                ))}
            </div>
            <span className="space-x-2 text-muted-foreground text-sm">
                Created {createdAt} • Updated {updatedAt}
            </span>
        </div>
    )
}