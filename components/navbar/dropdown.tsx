"use client";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes"
import {
    DropdownMenu, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuTrigger,
    DropdownMenuContent, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/login/actions";
import { useSettingsModal } from "@/app/context/settings-modal";
import { Button } from "../ui/button";
import { ChevronDown } from 'lucide-react';
import { useUserContext } from "@/components/userContext";


export const Dropdown = () => {
    const { user, updateUser } = useUserContext()
    const { setTheme, theme } = useTheme()
    const { openSettings } = useSettingsModal();

    const handleThemeChange = () => {
        if (theme === "light") setTheme("dark")
        else setTheme("light")
    }

    const updatePfp = async () => {
        const url = "https://i.pinimg.com/1200x/b8/2f/13/b82f131f10933bdc88469afdb4415070.jpg"
        await updateUser({ avatarUrl: url })
    }

    if (!user) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="icon">
                    <ChevronDown size={30} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={15} >
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/${user.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Billing</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openSettings("subscription")}>
                    Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleThemeChange()}>
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openSettings()}>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updatePfp()}>
                    Update PFP
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={signOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};  