import type { FolderWithCounts } from "@/types/folders";
import { FolderNav } from "@/app/(app)/[username]/[folder]/components/folder-nav";
import { EditButton } from "@/app/(app)/[username]/[folder]/components/form-container";

function parseDate(date: string) {
    return new Date(date)
        .toLocaleDateString("en-US", {
            year: "2-digit",
            month: "short",
            day: "numeric"
        });
}

function parseCount(counts: Record<string, number>) {
    return Object.values(counts).reduce((acc, item) => acc + item, 0);
}

export default function FolderDetails({
    folder,
    canEdit
}: {
    folder: FolderWithCounts
    canEdit: boolean
}) {

    const itemCount = parseCount(folder.mediaCounts);
    const createdAt = parseDate(folder.createdAt);
    const updatedAt = parseDate(folder.lastUpdated);

    return (
        <div className="flex flex-col max-w-2xl font-sans text-primary">
            <FolderNav username={folder.ownerUsername} slug={folder.slug} />
            <h1 className="inline-flex items-center gap-2 mt-4 font-semibold text-4xl">
                {folder.name} {canEdit && <EditButton folder={folder} />}
            </h1>

            {folder.description &&
                <h2 className="text-muted-foreground">
                    {folder.description}
                </h2>
            }
            <div className="space-x-2 mt-3 text-muted-foreground text-sm">
                <span>{itemCount} Posts</span>
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