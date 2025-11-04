import { ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu'
import React from 'react'
import Konva from 'konva';
import type { GroupContent, GroupWrapper } from '../features/types';
import { useStore } from '../features/store';
import { ImageNode } from '../features/types';

const ImageMenu = () => {
    const { menu } = useStore();
    if (!menu.object || !(menu.object instanceof Konva.Image)) return;
    const node = menu.object as ImageNode;

    const boards: GroupContent[] = node.getAddableBoards();
    const isGrouped = node.isGrouped();

    return (
        <>
            {menu.type === "image" && menu.object === node && (
                <>
                    <OpenInNewTab node={node} />
                    <ViewPost node={node} />
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>Transform</ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem onClick={() => node.rotateImage('left')}>
                                Rotate left
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => node.rotateImage('right')}>
                                Rotate right
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => node.flipImage('horizontal')}>
                                Flip horizontal
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => node.flipImage('vertical')}>
                                Flip vertical
                            </ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub >
                    <AddToBoard boards={boards} node={node} />
                    {isGrouped && <ContextMenuItem
                        variant="destructive"
                        onClick={() => node.removeFromGroup()}>
                        Remove from group
                    </ContextMenuItem>}
                    <ContextMenuItem onClick={() => node.destroyImage()}
                        variant="destructive">
                        Delete
                    </ContextMenuItem>
                </>
            )}
        </>
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

const AddToBoard = ({
    boards,
    node,
}: {
    boards: GroupContent[],
    node: Konva.Image,
}) => {

    const addToGroup = (board: GroupContent) => {
        board.addNodes([node]);
    };

    const getParentName = (board: GroupContent) => {
        return (board.getParent() as GroupWrapper).getTitle();
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