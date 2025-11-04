import React from 'react'
import { ContextMenuItem } from '@/components/ui/context-menu'
import type { GroupWrapper } from '../features/types';
import Konva from 'konva';
import { useStore } from '../features/store';

const GroupMenu = () => {
    const setGroup = useStore((s) => s.setGroup);
    const group = useStore((s) => s.group);
    const menu = useStore((s) => s.menu);

    if (!menu.object || !(menu.object instanceof Konva.Group)) return;
    const node = menu.object as GroupWrapper;
    const deleteGroup = () => {
        node.deleteGroup();
        if (group === node) {
            setGroup(null);
        }
    }
    const editGroup = () => { }

    return (
        <>
            {menu.type === "group" && menu.object === node && (
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
            )}
        </>
    )
}

export default GroupMenu