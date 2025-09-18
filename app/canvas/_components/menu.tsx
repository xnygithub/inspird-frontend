import React from 'react'

interface MenuProps {
    children: React.ReactNode;
    menuPosition: { x: number, y: number };
}

export function Menu({ children, menuPosition }: MenuProps) {
    return (
        <div
            style={{
                position: "fixed",
                top: menuPosition.y,
                left: menuPosition.x,
                width: 125,
                backgroundColor: "white",
                boxShadow: "0 0 5px grey",
                borderRadius: 4,
                zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div >
    )
}


export function Delete({ handleDelete }: { handleDelete: () => void }) {
    return (
        <button
            style={{
                width: "100%",
                background: "white",
                border: "none",
                padding: "8px 10px",
                cursor: "pointer",
                color: "black",
            }}
            onMouseOver={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "lightgray")
            }
            onMouseOut={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "white")
            }
            onClick={handleDelete}
        >
            Delete
        </button>
    )
}
