import React from 'react'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import type { OuterGroup } from '../types';
import Konva from 'konva';
import { useCanvasStore } from '../store';

const GroupMenu = ({
    canvasRef,
}: {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}) => {
    const { menu } = useCanvasStore();
    if (!menu.object || !(menu.object instanceof Konva.Group)) return;
    const node = menu.object as OuterGroup;
    const deleteGroup = () => node.deleteGroup();
    const editGroup = () => { }

    return (
        <>
            <ContextMenuItem
                onClick={editGroup}>
                Edit group
            </ContextMenuItem>
            <ContextMenuItem
                variant="destructive"
                onClick={deleteGroup}>
                Delete group
            </ContextMenuItem>
        </>
    )
}

export default GroupMenu