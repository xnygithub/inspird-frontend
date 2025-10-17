"use client";
import React from 'react'
import { ContextMenuContent, ContextMenuSeparator } from '@radix-ui/react-context-menu';
import { cn } from '@/lib/utils';
import { ContextMenuItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from '@/components/ui/context-menu';
import { useCanvas } from '../provider';

const ImageMenu = () => {
    const { refs: { imgRef } } = useCanvas();

    function openNewTab() {
        if (!imgRef.current) return;

        const imageElement = imgRef.current.image(); // HTMLImageElement
        const imageSrc = imageElement?.src; // string | undefined

        if (!imageSrc) return;
        window.open(imageSrc, "_blank");

    }

    function viewSource() {
        if (!imgRef.current) return;

        const postId = imgRef.current.getAttr('postId');
        if (!postId) return;
        window.open(`/posts/${postId}`, "_blank");
    }

    function rotate(direction: 'left' | 'right') {
        if (!imgRef.current) return;
        imgRef.current.rotate(direction === 'left' ? -90 : 90);
        imgRef.current.getLayer()?.batchDraw();
    }

    function flip(direction: 'horizontal' | 'vertical') {
        if (!imgRef.current) return;

        const currentScale = imgRef.current.scaleX();
        if (direction === 'horizontal') {
            imgRef.current.scaleX(-currentScale);
        } else {
            imgRef.current.scaleY(-imgRef.current.scaleY());
        }
        imgRef.current.getLayer()?.batchDraw();
    }

    function deleteImage() {
        if (!imgRef.current) return;
        console.log("deleting image: ", imgRef.current.id());
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
            <ContextMenuItem>Duplicate</ContextMenuItem>
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
                <ContextMenuItem variant="destructive" onClick={() => deleteImage()}>Delete</ContextMenuItem>
            </ContextMenuSub>
        </ContextMenuContent >
    )
}


export { ImageMenu }