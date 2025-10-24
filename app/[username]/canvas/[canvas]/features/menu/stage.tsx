import { ContextMenuItem, ContextMenuLabel } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/core/KonvaCanvas'
import React from 'react'

interface Props {
    menuType: string;
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}
const StageMenu = ({ menuType, canvasRef }: Props) => {
    const addRandom = async () => {
        await canvasRef.current?.images.addImage("https://picsum.photos/320/200", {
            x: Math.random() * 500,
            y: Math.random() * 300,
        });
    };
    return (
        <>
            <ContextMenuLabel>{menuType}</ContextMenuLabel>
            <ContextMenuItem onClick={addRandom}>Add random image</ContextMenuItem>
        </>
    )
}

export default StageMenu