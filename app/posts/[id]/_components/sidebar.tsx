import { OFFSET, WIDTH } from "@/app/posts/[id]/sidebar.constants"

export default function Sidebar({ open }: { open: boolean }) {
    return (
        <div
            id="sidebar-container"
            style={{
                marginTop: OFFSET,
                width: WIDTH,
                transform: open ? "translateX(0)" : "translateX(100%)"
            }}>
        </div>
    )
}
