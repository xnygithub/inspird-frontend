import React from 'react'
import { ContextMenuItem } from '@/components/ui/context-menu'
import type { GroupWrapper } from '../../features/types';
import Konva from 'konva';
import { useCanvasStore } from '../../features/store';

const GroupMenu = () => {
    const { menu } = useCanvasStore();
    if (!menu.object || !(menu.object instanceof Konva.Group)) return;
    const node = menu.object as GroupWrapper;
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