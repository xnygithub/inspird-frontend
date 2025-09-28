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
import { signOut } from "@/app/login/actions";
import { Settings } from "@/components/settings/settings";


export const Dropdown = ({ username }: { username: string }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>▼</DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={15}>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/${username}`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Settings open={open} setOpen={setOpen} />
        </>
    );
};  