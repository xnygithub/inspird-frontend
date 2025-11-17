"use client"
import { useMediaQuery } from 'usehooks-ts'
import { createContext, useContext, useMemo, useState } from "react";
import { OFFSET, WIDTH } from "@/app/(app)/posts/[id]/sidebar.constants"
import Sidebar from "@/app/(app)/posts/[id]/_components/sidebar"


interface SidebarProviderProps {
    children: React.ReactNode
}

interface SidebarContextValue {
    open: boolean
    setOpen: (value: boolean) => void
    toggle: () => void
    width: number
    offset: number
    isMobile: boolean
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) throw new Error("useSidebar must be used within SidebarProvider")
    return context
}

export default function SidebarProvider({ children }: SidebarProviderProps) {
    const [open, setOpen] = useState<boolean>(false)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const value = useMemo<SidebarContextValue>(() => ({
        open,
        setOpen,
        toggle: () => setOpen((prev) => !prev),
        width: WIDTH,
        offset: OFFSET,
        isMobile,
    }), [open, isMobile])

    return (
        <SidebarContext.Provider value={value}>
            <div id="post-container"
                style={{ marginRight: open ? (!isMobile ? WIDTH : 0) : 0 }}>
                {children}
            </div>
            <Sidebar />
        </SidebarContext.Provider>
    )
}