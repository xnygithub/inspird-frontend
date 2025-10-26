import React from 'react'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import { OuterGroup } from '../types';

const GroupMenu = ({
    node,
    canvasRef,
}: {
    node: OuterGroup;
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}) => {

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