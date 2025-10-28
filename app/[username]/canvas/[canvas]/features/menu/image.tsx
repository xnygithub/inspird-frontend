import { ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import React from 'react'
import Konva from 'konva';
import { createGroup } from '../nodes/group';
import type { GroupWithUpdate } from '../types';
import { addableBoards, filterNodes } from '@/app/[username]/canvas/[canvas]/features/functions/utils';
import { useCanvasStore } from '../store';

interface Props {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}
const ImageMenu = ({
    canvasRef,
}: Props) => {
    const { menu, selectedNodes } = useCanvasStore();
    if (!menu.object || !(menu.object instanceof Konva.Image)) return;
    const node = menu.object as Konva.Image;

    const layer = canvasRef.current?.getContentLayer();
    const transformer = canvasRef.current?.getTransformer();
    if (!layer || !transformer || !node) return;

    const boards: GroupWithUpdate[] = addableBoards(node, layer);
    const parent: GroupWithUpdate = node.getParent() as GroupWithUpdate;
    const isGrouped = parent.name() === "group-content";

    const deleteNode = () => {
        node.destroy();
        if (isGrouped) {
            parent.updateBackground();
        }
        transformer.nodes([]);
        layer.batchDraw();
    };

    const openInNewTab = () => {
        const src = node.getAttr('src') as string;
        if (!src) return;
        window.open(src, "_blank");
    };

    const groupImage = () => {
        if (!selectedNodes) return;
        const images = filterNodes(selectedNodes, ["image-node"]);
        if (images.length === 0) return;
        const { innerNode } = createGroup(layer, transformer);
        innerNode.addNodes(images);
    };

    const rotate = (dir: 'l' | 'r') => {
        node.rotate((dir === 'l' ? -90 : 90));
        if (isGrouped) {
            parent.updateBackground();
        }
    };

    const flip = (dir: 'h' | 'v') => {
        if (dir === 'h') {
            node.scaleX(-node.scaleX());
            return;
        }
        node.scaleY(-node.scaleY());

    };

    const addToGroup = (board: GroupWithUpdate) => {
        board.addNodes([node as Konva.Image]);
        layer.batchDraw();
    };

    const removeFromGroup = () => {
        if (!isGrouped) return;
        parent.removeNodes([node as Konva.Image]);
        layer.batchDraw();
    };

    return (
        <>
            <ContextMenuItem className="text-xs" onClick={openInNewTab}>Open in new tab</ContextMenuItem>
            <ContextMenuItem disabled={true}>View post</ContextMenuItem>
            <ContextMenuItem
                onClick={groupImage}
                disabled={isGrouped || selectedNodes?.length === 0}>
                Group selection
            </ContextMenuItem>
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    Transform
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <ContextMenuItem onClick={() => rotate('l')}>Rotate left</ContextMenuItem>
                    <ContextMenuItem onClick={() => rotate('r')}>Rotate right</ContextMenuItem>
                    <ContextMenuItem onClick={() => flip('h')}>Flip horizontal</ContextMenuItem>
                    <ContextMenuItem onClick={() => flip('v')}>Flip vertical</ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
            {boards.length > 0 && <ContextMenuSub>
                <ContextMenuSubTrigger disabled={boards.length === 0}>
                    Add to group
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    {boards.map((board) => (
                        <ContextMenuItem
                            key={board.id()}
                            onClick={() => addToGroup(board)}>
                            {board.getParent()?.getGroupName()}
                        </ContextMenuItem>
                    ))}
                </ContextMenuSubContent>
            </ContextMenuSub>}
            {isGrouped && <ContextMenuItem
                variant="destructive"
                onClick={removeFromGroup}
                disabled={!isGrouped}>
                Remove from group
            </ContextMenuItem>}
            <ContextMenuItem variant="destructive" onClick={deleteNode}>Delete</ContextMenuItem>
        </>
    )
}

export default ImageMenu