"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "../ui/button";
import { ChevronDown, CreditCard, Palette } from 'lucide-react';
import { useUserContext } from "@/components/userContext";
import { Switch } from "@/components/ui/switch";
import { LogOut, HelpCircle, MessageCircle, Settings, UserRound, Folder, Brush, Upload, Moon, Sun } from "lucide-react";

// TODO: Check whether the user is pro: if so; 
// 1. Conditionally render the Pro badge
// 2. Conditionally render their banner image

export const Dropdown = () => {
    const { user } = useUserContext()
    const { setTheme, theme } = useTheme()

    const handleThemeChange = () => {
        if (theme === "light") {
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }

    if (!user) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="icon">
                    <ChevronDown size={30} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10} className="max-md:hidden bg-popover p-0 rounded-sm w-[275px] font-sans !animate-none">
                <div className="relative mb-8 w-full h-16">
                    <Image
                        fill
                        alt="Banner"
                        src={user.bannerUrl}
                        className="object-center object-cover"
                    />
                    <div className="bottom-0 left-2 absolute rounded-full outline-[0.25rem] outline-popover w-14 h-14 overflow-hidden translate-y-1/2">
                        <Image
                            fill
                            alt="Avatar"
                            src={user.avatarUrl}
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="px-1 pb-1 font-normal text-primary">
                    <div className="flex flex-row justify-between items-center px-2 py-1.5">
                        <div className="flex flex-col gap-0">
                            <span className="text-primary"> {user.displayName} </span>
                            <span className="text-muted-foreground text-xs"> @{user.username} </span>
                        </div>
                        <div className="bg-green-500/30 px-5 py-1.5 rounded-full text-white text-xs">
                            Pro
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuLabel>Account</DropdownMenuLabel> */}
                    <DropdownMenuItem asChild>
                        <Link href={`/${user.username}`}><UserRound /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/settings`}><Settings size={4} /> Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuLabel>Content</DropdownMenuLabel> */}
                    <DropdownMenuItem><Folder size={4} /> Folders</DropdownMenuItem>
                    <DropdownMenuItem><Brush size={4} /> Canvas</DropdownMenuItem>
                    <DropdownMenuItem><Upload size={4} /> Upload</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/settings/billing`}>
                            <CreditCard size={4} />
                            Billing
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/settings/appearance`}>
                            <Palette size={4} /> Appearance
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(event) => event.preventDefault()}>
                        {theme === "light" ? <Moon size={4} /> : <Sun size={4} />}
                        {theme === "light" ? "Dark Mode" : "Light Mode"}
                        <Switch
                            className="ml-auto"
                            checked={theme === "dark"}
                            onCheckedChange={handleThemeChange}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuLabel>Resources</DropdownMenuLabel> */}

                    <DropdownMenuItem><HelpCircle size={4} /> Help</DropdownMenuItem>
                    <DropdownMenuItem><MessageCircle size={4} /> Feedback</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={signOut}>
                        <LogOut size={4} /> Logout
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};  