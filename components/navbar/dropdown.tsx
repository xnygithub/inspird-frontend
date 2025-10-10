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


export const Dropdown = ({ username }: { username: string }) => {
    const { setTheme, theme } = useTheme()
    const { openSettings } = useSettingsModal();

    const handleThemeChange = () => {
        if (theme === "light") setTheme("dark")
        else setTheme("light")
    }

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
                    <Link href={`/${username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openSettings()}>
                    Settings
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
                <DropdownMenuItem onClick={signOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};  