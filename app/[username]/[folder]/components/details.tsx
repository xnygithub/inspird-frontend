import "@/app/[username]/[folder]/folder.css";
import { FolderWithCounts } from "@/app/[username]/[folder]/types";
import { EditFolder } from "@/app/[username]/[folder]/components/form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


export const FolderDetails = async ({
    folder,
    canEdit,
}: {
    folder: FolderWithCounts;
    canEdit: boolean;
}) => {
    const totalCount = Object
        .values(folder.mediaCounts)
        .reduce((acc: number, item: number) => acc + item, 0);

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList >
                    <BreadcrumbItem >
                        <BreadcrumbLink
                            href={`/${folder.owner.username}`}>
                            {folder.owner.username}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {folder.slug}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-row items-center space-x-2">
                <h1 id="folder-name">{folder.name}</h1>
                {canEdit && <EditFolder folder={folder} />}
            </div>
            {folder.description && <p id="folder-description">{folder.description}</p>}
            <div className="flex flex-row space-x-2 font-semibold text-[14px] text-gray-500">
                <p>{totalCount} Posts</p>
                <p>{folder.mediaCounts.image} images</p>
                <p>{folder.mediaCounts.video} videos</p>
                <p>{folder.mediaCounts.gif} gifs</p>
            </div>
            <div className="flex flex-row space-x-2 font-semibold text-[14px] text-gray-500">
                <p>Created {new Date(folder.createdAt).toLocaleDateString()}</p>
                <p>Updated {new Date(folder.lastUpdated).toLocaleDateString()}</p>
            </div>
        </>
    )
}