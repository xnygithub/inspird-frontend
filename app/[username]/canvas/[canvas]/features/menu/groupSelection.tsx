import React from 'react'
import { ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu'
import { KonvaCanvasHandle } from '@/app/[username]/canvas/[canvas]/features/KonvaCanvas'
import type { GroupWithUpdate } from '../types';
import { groupableBoards } from '@/app/[username]/canvas/[canvas]/features/functions/utils';
import { useCanvasStore } from '../store';

interface Props {
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}
const GroupSelectionMenu = ({
    canvasRef,
}: Props) => {
    const { selectedNodes } = useCanvasStore();
    const layer = canvasRef.current?.getContentLayer();
    if (!layer) return;
    const boards: GroupWithUpdate[] = groupableBoards(layer!);

    const addToGroup = (board: GroupWithUpdate) => {
        board.addNodes(selectedNodes);
        layer.batchDraw();
    };

    const disabled = boards.length === 0 || selectedNodes?.length === 0;

    return (
        <>
            {boards.length > 0 && <ContextMenuSub>
                <ContextMenuSubTrigger disabled={disabled}>
                    Add to group
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    {boards.map((board) => (
                        <ContextMenuItem
                            key={board.id()}
                            onClick={() => addToGroup(board)}>
                            {board.name()}
                        </ContextMenuItem>
                    ))}
                </ContextMenuSubContent>
            </ContextMenuSub>}
        </>
    )
}

export default GroupSelectionMenu