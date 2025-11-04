import { ContextMenuItem } from '@/components/ui/context-menu'
import React from 'react'
import createText from '../features/nodes/text';
import { useStore } from '../features/store';

const StageMenu = () => {
    const menu = useStore((s) => s.menu);
    const layer = useStore((s) => s.contentLayer);
    const transformer = useStore((s) => s.transformer);
    if (menu.object) return;
    if (!layer || !transformer) return;

    const addText = () => {
        const textNode = createText(layer);
        if (textNode) layer.add(textNode);
    }

    return (
        <>
            {menu.type === "stage" && menu.object === null && (
                <>
                    <ContextMenuItem
                        onClick={addText}>
                        Create text
                    </ContextMenuItem>
                </>
            )}
        </>
    )
}

export default StageMenu