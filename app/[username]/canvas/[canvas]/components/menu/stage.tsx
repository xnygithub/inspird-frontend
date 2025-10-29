import { ContextMenuItem } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/canvas'
import React from 'react'
import createText from '../../features/nodes/text';
import { useCanvasStore } from '../../features/store';

const StageMenu = ({
    canvasRef
}: {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>
}) => {
    const { menu } = useCanvasStore();
    if (menu.object) return;
    const api = canvasRef.current
    if (!api) return;

    const layer = api.getContentLayer();
    const transformer = api.getTransformer();
    if (!layer || !transformer) return;


    const addText = () => {
        const textNode = createText(layer);
        if (textNode) layer.add(textNode);
    }

    return (
        <>
            <ContextMenuItem
                onClick={addText}>
                Create text
            </ContextMenuItem>
        </>
    )
}

export default StageMenu