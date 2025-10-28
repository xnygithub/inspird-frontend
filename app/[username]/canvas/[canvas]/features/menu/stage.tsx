import { ContextMenuItem } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import { addImage } from '../nodes/image';
import React from 'react'
import { KonvaText } from '../nodes/text';
import { saveToLocalStorage } from '../functions/saveLoadToJson';
import { useCanvasStore } from '../store';

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


    const addRandomImage = async () => {
        await addImage(layer, transformer, "https://picsum.photos/320/200");
    };

    const saveGroup = () => {
        const canvas = api.saveCanvas();
        if (!canvas) return;
    };

    const createText = () => {
        const textNode = KonvaText(layer);
        if (textNode) layer.add(textNode);
    }

    const saveCanvas = () => {
        const canvas = api.getStage();
        if (!canvas) return;
        saveToLocalStorage(canvas);
    }

    return (
        <>
            <ContextMenuItem
                onClick={saveGroup}>
                Save Canvas
            </ContextMenuItem>
            <ContextMenuItem
                onClick={addRandomImage}>
                Add Random Image
            </ContextMenuItem>
            <ContextMenuItem
                onClick={createText}>
                Create text
            </ContextMenuItem>
            <ContextMenuItem
                onClick={saveCanvas}>
                Save to localStorage
            </ContextMenuItem>
        </>
    )
}

export default StageMenu