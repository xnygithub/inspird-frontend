import { ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import React from 'react'
import Konva from 'konva';
import { createGroup } from '../group';
import type { GroupWithUpdate } from '../types';
import { addableBoards, filterNodes } from '@/app/[username]/canvas/[canvas]/features/functions/utils';

interface Props {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
    node: Konva.Image;
}
const ImageMenu = ({
    canvasRef,
    node
}: Props) => {

    const layer = canvasRef.current?.getContentLayer();
    const transformer = canvasRef.current?.getTransformer();
    const selectedNodes = canvasRef.current?.getSelectedNodes();
    if (!layer || !transformer || !node) return;

    const boards = addableBoards(node, layer);
    const parent = node.getParent() as Konva.Group | Konva.Layer;
    const isGrouped = parent.name() === "group-content";

    const deleteImage = () => {
        node.destroy();
        if (isGrouped) {
            // @ts-expect-error - parent has this func
            parent.updateBackground();
        }
        transformer.nodes([]);
        layer.batchDraw();
    };

    const sourceImage = () => {
        window.open(node.getAttr('src') as string, "_blank");
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
            // @ts-expect-error - parent has this func
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
        // @ts-expect-error - parent has this func
        parent.removeNodes([node as Konva.Image]);
        layer.batchDraw();
    };

    return (
        <>

            <ContextMenuItem className="text-xs" onClick={sourceImage}>Open in new tab</ContextMenuItem>
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
                            key={board.id()} // TODO: Fix this, its undefined atm
                            onClick={() => addToGroup(board)}>
                            {board.getGroupName()}
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
            <ContextMenuItem variant="destructive" onClick={deleteImage}>Delete</ContextMenuItem>
        </>
    )
}

export default ImageMenu