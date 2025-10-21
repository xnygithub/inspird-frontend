"use client";
import React from 'react'
import { cn } from '@/lib/utils';
import { ContextMenuContent } from '@radix-ui/react-context-menu';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';

const GroupMenu = () => {

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
            <ContextMenuItem >Edit</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete Group</ContextMenuItem>
        </ContextMenuContent >
    )
}


export { GroupMenu }