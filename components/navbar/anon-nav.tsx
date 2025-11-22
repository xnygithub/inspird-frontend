"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from 'usehooks-ts'
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NavbarLink = ({
    href,
    text,
    active
}: {
    href: string,
    text: string,
    active: boolean
}) => {
    return (
        <Link href={href}>
            <span className={cn("font-sans text-muted-foreground hover:text-foreground transition-colors",
                active && "text-foreground")}>
                {text}
            </span>
        </Link>
    );
};

const SheetItemLink = ({
    href,
    text,
    onClick
}: {
    href: string,
    text: string
    onClick: () => void
}) => {

    return (
        <Link href={href} onClick={onClick}>
            <span className="block py-3 pt-1.5 border-b border-b-border w-full font-normal text-muted-foreground hover:text-foreground text-2xl text-right transition-colors">
                {text}
            </span>
        </Link>
    );

}


export const AnonNavbar = () => {
    const path = usePathname()
    return (
        <div className={
            cn("top-0 right-0 left-0 fixed",
                "bg-navbar border-border border-b",
                "h-[var(--nav-height)] transition-all duration-500 z-10")} >
            <div className="flex flex-row justify-between items-center mx-auto px-6 sm:px-12 max-w-[1500px] h-full">
                < Link href="/" >
                    <span className="inline-flex items-center font-sans font-medium text-lg leading-none translate-y-[2px]">
                        Inspird.
                    </span>
                </Link >
                <div className="max-lg:hidden top-1/2 left-1/2 absolute flex flex-row items-center gap-8 -translate-x-1/2 -translate-y-1/2 select-none">
                    <NavbarLink href="/" text="Home" active={path === '/'} />
                    <NavbarLink href="/home" text="Discover" active={path === '/discover'} />
                    <NavbarLink href="/" text="Features" active={path === '/features'} />
                    <NavbarLink href="/" text="About" active={path === '/about'} />
                </div>
                <div className="flex flex-row justify-end items-center gap-4 w-full font-sans font-medium text-sm">
                    <Link href="/login">
                        Login
                    </Link>
                    <Link href="/signup" className="bg-primary hover:brightness-85 px-4 py-1.5 rounded-full text-primary-foreground transition-all duration-200">
                        Signup
                    </Link>
                    <MenuSheet />
                </div>
            </div>
        </div >
    );
};



export const MenuSheet = () => {
    const [open, setOpen] = useState(false);
    const closeSheet = () => setOpen(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (!isMobile) setOpen(false);
    }, [isMobile]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="icon" size="icon" className="lg:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="px-8 pt-6 pb-20 min-w-full font-sans" >
                <SheetTitle hidden>Menu</SheetTitle>
                <span className="mb-12 font-sans font-medium text-2xl">Inspird</span>
                <div className="flex flex-col justify-between gap-6 h-full">
                    <div className="flex flex-col gap-2">
                        <SheetItemLink href="/" text="Home" onClick={closeSheet} />
                        <SheetItemLink href="/discover" text="Discover" onClick={closeSheet} />
                        <SheetItemLink href="/features" text="Features" onClick={closeSheet} />
                        <SheetItemLink href="/faq" text="FAQ" onClick={closeSheet} />
                        <SheetItemLink href="/about" text="About" onClick={closeSheet} />
                        <SheetItemLink href="/terms" text="Terms" onClick={closeSheet} />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <SheetItemLink href="/login" text="Login" onClick={closeSheet} />
                        <SheetItemLink href="/signup" text="Register" onClick={closeSheet} />
                    </div>
                </div>
            </SheetContent>
        </Sheet >
    );
};