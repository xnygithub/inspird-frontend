'use client'
import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    NavigationMenuIndicator,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from 'usehooks-ts'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="font-medium text-sm leading-none">{title}</div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}


const MobileMenu = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="icon" size="icon" className="lg:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="min-w-full min-h-svh font-sans" >
                <SheetTitle>Menu</SheetTitle>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu