import { useSidebar } from "@/app/(app)/posts/[id]/_components/sidebar.provider"
import { OFFSET, WIDTH } from "@/app/(app)/posts/[id]/sidebar.constants"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function Sidebar() {
    const { open, toggle } = useSidebar()
    return (
        <div
            id="sidebar-container"
            style={{
                marginTop: OFFSET,
                width: WIDTH,
                transform: open ? "translateX(0)" : "translateX(100%)"
            }}>
            <div className="top-4 right-4 absolute flex flex-col gap-4">
                <Button onClick={toggle} className="w-fit">
                    <X />
                </Button>
            </div>
        </div>
    )
}
