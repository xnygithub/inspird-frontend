import { ContextMenuItem, ContextMenuLabel } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/core/KonvaCanvas'
import React from 'react'
import Konva from 'konva';
import { KonvaGroup } from '../groups/service';
import type { GroupWithUpdate } from '../../core/types';


interface Props {
    menuType: string;
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
    menuTarget: Konva.Node | null;
}
const ImageMenu = ({
    menuType,
    canvasRef,
    menuTarget
}:
    Props) => {

    const deleteImage = () => {
        menuTarget?.destroy();
    };

    const sourceImage = () => {
        const src = menuTarget?.getAttr('src');
        console.log(src);
        if (!src) return;
        window.open(src, "_blank");
    };

    const groupImage = () => {
        const transformer = canvasRef.current?.getTransformer();
        if (!transformer) return;
        const selectedNodes = canvasRef.current?.getSelectedNodes();
        if (!selectedNodes) return;
        const layer = canvasRef.current?.getContentLayer();
        if (!layer) return;
        KonvaGroup(layer, selectedNodes, transformer);
    };

    const rotate = (dir: 'l' | 'r') => {
        const group = menuTarget?.getParent();
        if ((group instanceof Konva.Group) && group.hasName("group-inner")) {
            menuTarget?.rotate((dir === 'l' ? -90 : 90));
            (group as GroupWithUpdate).updateBg();
            return;
        } else {
            menuTarget?.rotate((dir === 'l' ? -90 : 90));
            return;
        }
    };

    const flip = (dir: 'h' | 'v') => {
        if (dir === 'h') {
            menuTarget?.scaleX(-menuTarget?.scaleX());
            return;
        }
        menuTarget?.scaleY(-menuTarget?.scaleY());

    };

    // const handleAddToGroup = () => {
    //     const layer = canvasRef.current?.getContentLayer();
    //     const groups = layer?.find(".group-inner");

    //     const firstGroup = groups?.[0];
    //     console.log("firstGroup", firstGroup);
    //     if (!firstGroup) return;

    //     const selectedNodes = canvasRef.current?.getSelectedNodes();
    //     if (!selectedNodes || selectedNodes.length === 0) return;

    //     selectedNodes.forEach(n => {
    //         const abs = n.getAbsolutePosition();
    //         (firstGroup as Konva.Group).add(n as Konva.Shape);
    //         n.setAbsolutePosition(abs);
    //     });

    //     // Optionally, redraw the layer
    //     layer?.batchDraw();
    // };

    return (
        <>
            <ContextMenuLabel>{menuType}</ContextMenuLabel>
            <ContextMenuItem onClick={deleteImage}>Delete</ContextMenuItem>
            <ContextMenuItem onClick={sourceImage}>Source</ContextMenuItem>
            <ContextMenuItem onClick={groupImage}>Group</ContextMenuItem>
            <ContextMenuItem onClick={() => rotate('l')}>Rotate left</ContextMenuItem>
            <ContextMenuItem onClick={() => rotate('r')}>Rotate right</ContextMenuItem>
            <ContextMenuItem onClick={() => flip('h')}>Flip horizontal</ContextMenuItem>
            <ContextMenuItem onClick={() => flip('v')}>Flip vertical</ContextMenuItem>
        </>
    )
}

export default ImageMenu