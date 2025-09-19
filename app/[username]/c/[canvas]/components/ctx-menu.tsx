interface CtxMenuProps {
    position: { x: number; y: number };
    children: React.ReactNode;
}

export default function CtxMenu({ position, children }: CtxMenuProps) {
    return (
        <div
            style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    )
}