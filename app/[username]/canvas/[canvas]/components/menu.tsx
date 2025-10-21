"use client";
import type Konva from 'konva';
import React from 'react'
import { ContextMenuContent } from '@radix-ui/react-context-menu';
import { cn } from '@/lib/utils';
import { ContextMenuItem, ContextMenuSub, ContextMenuSeparator, ContextMenuSubTrigger, ContextMenuSubContent } from '@/components/ui/context-menu';
import { useCanvas } from '../provider';

const ImageMenu = () => {
    const { refs: { tfRef }, GroupSelection, removeItemFromGroup, ctxMenu } = useCanvas();
    const selectedNodes = tfRef.current?.nodes();

    if (!ctxMenu.ref) return null;
    const ref = ctxMenu.ref as Konva.Image;

    function openNewTab() {
        const src = ref.getAttr('src');
        if (!src) return;
        window.open(src, "_blank");

    }

    function viewSource() {
        const postId = ref.getAttr('postId');
        if (!postId) return;
        window.open(`/posts/${postId}`, "_blank");
    }

    function rotate(dir: 'left' | 'right') {
        ref.rotate((dir === 'left' ? -90 : 90));
    }

    function flip(dir: 'horizontal' | 'vertical') {
        if (dir === 'horizontal') {
            ref.scaleX(-ref.scaleX());
        }
        if (dir === 'vertical') {
            ref.scaleY(-ref.scaleY());
        }

    }

    function deleteImage() {
        ref.destroy();
    }

    function removeFromGroup() {
        const id = ref.getAttr('id');
        if (!id) return;
        removeItemFromGroup(id);
        if (tfRef.current && tfRef.current.nodes().includes(ref)) {
            tfRef.current.nodes(tfRef.current.nodes().filter(node => node !== ref));
        }
    }

    return (
        <ContextMenuContent className={cn(
            "[&_[data-slot='context-menu-item']]:text-xs",
            "[&_[data-slot='context-menu-sub-content']]:text-xs",
            "[&_[data-slot='context-menu-sub-trigger']]:text-xs",
            "bg-popover font-sans text-popover-foreground",
            " data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            " data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height)",
            " min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md"
        )}>
            <ContextMenuItem onClick={openNewTab}>Open in new tab</ContextMenuItem>
            <ContextMenuItem onClick={viewSource}>View source</ContextMenuItem>
            <ContextMenuSeparator />

            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    Group
                </ContextMenuSubTrigger>
                <ContextMenuSubContent >
                    <ContextMenuItem
                        onClick={GroupSelection}
                        disabled={selectedNodes && selectedNodes.length < 2}>
                        Create Group
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={removeFromGroup}
                        disabled={ref.getParent()?.getClassName() !== "Group"}
                    >
                        Remove from Group
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    Transform
                </ContextMenuSubTrigger>
                <ContextMenuSubContent >
                    <ContextMenuItem onClick={() => rotate('left')}>Rotate Left</ContextMenuItem>
                    <ContextMenuItem onClick={() => rotate('right')}>Rotate Right</ContextMenuItem>
                    <ContextMenuItem onClick={() => flip('horizontal')}>Flip Horizontal</ContextMenuItem>
                    <ContextMenuItem onClick={() => flip('vertical')}>Flip Vertical</ContextMenuItem>
                </ContextMenuSubContent>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive" onClick={deleteImage}>Delete</ContextMenuItem>
            </ContextMenuSub>
        </ContextMenuContent >
    )
}


export { ImageMenu }