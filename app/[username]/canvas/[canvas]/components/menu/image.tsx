import { ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/canvas'
import React from 'react'
import Konva from 'konva';
import type { GroupContent, GroupWrapper } from '../../features/types';
import { addableBoards } from '@/app/[username]/canvas/[canvas]/features/functions/utils';
import { useCanvasStore } from '../../features/store';

const ImageMenu = ({
    canvasRef,
}: {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}) => {
    const { menu } = useCanvasStore();
    if (!menu.object || !(menu.object instanceof Konva.Image)) return;
    const node = menu.object;

    const layer = canvasRef.current?.getContentLayer();
    const transformer = canvasRef.current?.getTransformer();
    if (!layer || !transformer || !node) return;

    const boards: GroupContent[] = addableBoards(node, layer);
    const parent: GroupContent | Konva.Layer = node.getParent() as GroupContent | Konva.Layer;


    return (
        <>
            <OpenInNewTab node={node} />
            <ViewPost node={node} />
            <ContextMenuSub>
                <ContextMenuSubTrigger>Transform</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <RotateImage node={node} parent={parent} />
                    <FlipImage node={node} />
                </ContextMenuSubContent>
            </ContextMenuSub>
            <AddToBoard boards={boards} node={node} layer={layer} />
            <RemoveFromGroup node={node} layer={layer} />
            <DeleteNode node={node} layer={layer} transformer={transformer} />
        </>
    )
}

const DeleteNode = ({
    node,
    layer,
    transformer,
}: {
    node: Konva.Image,
    layer: Konva.Layer,
    transformer: Konva.Transformer,
}) => {

    const parent = node.getParent() as GroupContent | Konva.Layer;

    const deleteNode = () => {
        node.destroy();
        if (parent instanceof Konva.Group) {
            parent.updateBackground();
        }
        transformer.nodes([]);
        layer.batchDraw();
    };
    return (
        <ContextMenuItem variant="destructive" onClick={deleteNode}>Delete</ContextMenuItem>
    )
}
const ViewPost = ({
    node,
}: {
    node: Konva.Image,
}) => {
    const getDomain = (src: string) => {
        const url = new URL(src);
        return url.origin;
    }

    const viewPost = () => {
        const src = node.getAttr('src') as string;
        const postId = src.split('/').pop();
        if (!postId) return;
        window.open(`${getDomain(src)}/posts/${postId}`, "_blank");
    };
    return (
        <ContextMenuItem onClick={viewPost}>View post</ContextMenuItem>
    )
}

const OpenInNewTab = ({
    node,
}: {
    node: Konva.Image,
}) => {
    const openInNewTab = () => {
        const src = node.getAttr('src') as string;
        if (!src) return;
        window.open(src, "_blank");
    };
    return (
        <ContextMenuItem onClick={openInNewTab}>Open in new tab</ContextMenuItem>
    )
}

const RemoveFromGroup = ({
    node,
    layer,
}: {
    node: Konva.Image,
    layer: Konva.Layer,
}) => {
    const parent = node.getParent() as GroupContent | Konva.Layer;
    const isGrouped = parent instanceof Konva.Group;

    const removeFromGroup = () => {
        node.moveTo(layer);
        layer.batchDraw();
    };

    return (
        <>
            {isGrouped && <ContextMenuItem
                variant="destructive"
                onClick={removeFromGroup}
                disabled={!isGrouped}>
                Remove from group
            </ContextMenuItem>}
        </>
    )
}

const FlipImage = ({
    node,
}: {
    node: Konva.Image,
}) => {

    const flip = (dir: 'horizontal' | 'vertical') => {
        if (dir === 'horizontal') {
            node.scaleX(-node.scaleX());
            return;
        }
        node.scaleY(-node.scaleY());

    };

    return (
        <>
            <ContextMenuItem onClick={() => flip('horizontal')}>Flip horizontal</ContextMenuItem>
            <ContextMenuItem onClick={() => flip('vertical')}>Flip vertical</ContextMenuItem>
        </>
    )
}



const RotateImage = ({
    node,
    parent,
}: {
    node: Konva.Image,
    parent: GroupContent | Konva.Layer,
}) => {
    const rotate = (dir: 'left' | 'right') => {
        node.rotate((dir === 'left' ? -90 : 90));
        if (parent instanceof Konva.Group) {
            parent.updateBackground();
        }
    };
    return (
        <>
            <ContextMenuItem onClick={() => rotate('left')}>Rotate left</ContextMenuItem>
            <ContextMenuItem onClick={() => rotate('right')}>Rotate right</ContextMenuItem>
        </>
    )
}

const AddToBoard = ({
    boards,
    node,
    layer
}: {
    boards: GroupContent[],
    node: Konva.Image,
    layer: Konva.Layer
}) => {

    const addToGroup = (board: GroupContent) => {
        board.addNodes([node]);
        layer.batchDraw();
    };

    const getParentName = (board: GroupContent) => {
        return (board.getParent() as GroupWrapper).getGroupName();
    }
    return (
        <>
            {boards.length > 0 && <ContextMenuSub>
                <ContextMenuSubTrigger disabled={boards.length === 0}>
                    Add to group
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    {boards.map((board) => (
                        <ContextMenuItem
                            key={board.id()}
                            onClick={() => addToGroup(board)}>
                            {getParentName(board)}
                        </ContextMenuItem>
                    ))}
                </ContextMenuSubContent>
            </ContextMenuSub>
            }
        </>
    )
};

export default ImageMenu