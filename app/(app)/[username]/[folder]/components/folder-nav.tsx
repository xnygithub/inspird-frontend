import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"


export const FolderNav = (
    { username, slug }: { username: string, slug: string }
) => {
    return (
        <Breadcrumb>
            <BreadcrumbList className="sm:gap-1 text-sm" >
                <BreadcrumbItem  >
                    <BreadcrumbLink
                        href={`/${username}`}>
                        {username}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem  >
                    <BreadcrumbLink
                        href={`/${username}`}>
                        boards
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {slug}
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}