import { BreadcrumbItem, BreadcrumbList, Breadcrumb, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const NavigationBar = (
    { username, folder }: { username: string, folder: string }
) => {
    return (
        <Breadcrumb>
            <BreadcrumbList >
                <BreadcrumbItem >
                    <BreadcrumbLink
                        href={`/${username}`}>
                        {username}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {folder}
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}