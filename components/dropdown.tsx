"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/login/actions";
import { Settings } from "@/components/settings";


export const Dropdown = ({ user }: { user: User }) => {
    const [settingsOpen, setSettingsOpen] = useState(false)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>▼</DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={15}>
                    <DropdownMenuLabel >Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/${user?.user_metadata.username}`}>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel >Settings</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            <Settings open={settingsOpen} setOpen={setSettingsOpen} />
        </ >
    );
};  