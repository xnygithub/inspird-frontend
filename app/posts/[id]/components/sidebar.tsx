"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMediaQuery } from 'usehooks-ts'
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

interface SidebarProviderProps {
    children: React.ReactNode
}

export default function SidebarProvider({ children }: SidebarProviderProps) {
    const OFFSET = 75
    const WIDTH = 400
    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)')
    return (
        <div className="relative w-full overflow-hidden">
            <Button
                id="sidebar-button"
                onClick={() => setOpen(!open)}
                className={`${open ? `fixed right-[390px] top-[100px]` : "fixed right-4 top-[100px]"} z-100 `}>
                {open ? <FiChevronsLeft /> : <FiChevronsRight />}
            </Button>
            <div
                id="sidebar-post-container"
                style={{ marginRight: open ? !isMobile ? WIDTH : 0 : 0 }}
            >
                {children}
            </div>
            <div
                id="sidebar-container"
                className="fixed"
                style={{
                    marginTop: OFFSET,
                    marginRight: open ? "10px" : 0,
                    width: WIDTH,
                    transform: open ? "translateX(0)" : "translateX(100%)"
                }}
            >
            </div>
        </div>
    )
}