"use client";
import Link from "next/link";
import React from "react";
import {
    DropdownMenu, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuTrigger,
    DropdownMenuContent, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/login/actions";
import { useSettingsModal } from "@/app/context/settings-modal";


export const Dropdown = ({ username }: { username: string }) => {
    const { openSettings } = useSettingsModal();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>▼</DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={15}>
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
                <DropdownMenuItem onClick={signOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};  