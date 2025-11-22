"use client"
import { Button } from "@/components/ui/button"
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { useSidebar } from "@/app/(app)/posts/[id]/_components/sidebar.provider"

export default function ToggleSidebarButton() {
    const { open, toggle } = useSidebar()
    return (
        <Button id="sidebar-button" onClick={toggle}>
            {open ? <FiChevronsRight /> : <FiChevronsLeft />}
        </Button>
    )
}


