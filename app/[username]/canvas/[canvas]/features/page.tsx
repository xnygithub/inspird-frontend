"use client";
import ImageMenu from "./menu/image";
import StageMenu from "./menu/stage";
import GroupMenu from "./menu/group";
import React, { useRef } from "react";
import ToolbarContainer from "./toolbar/container";
import KonvaCanvas, { KonvaCanvasHandle } from "./KonvaCanvas";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import GroupEditor from "./nodes/groupEditor";
import { useCanvasStore } from "./store";


export default function Canvas() {
    const canvasRef = useRef<KonvaCanvasHandle>(null);
    const { editorOpen, menu } = useCanvasStore();
    return (
        <div className="padding-top">
            <ContextMenu>
                <ContextMenuTrigger>
                    <KonvaCanvas ref={canvasRef} />
                </ContextMenuTrigger>
                <ContextMenuContent className="[&_*]:text-xs !animate-none no-scrollbar">
                    {menu.type === "stage" && <StageMenu canvasRef={canvasRef} />}
                    {menu.type === "image" && <ImageMenu canvasRef={canvasRef} />}
                    {menu.type === "group" && <GroupMenu canvasRef={canvasRef} />}
                </ContextMenuContent>
            </ContextMenu>
            {canvasRef.current && <ToolbarContainer apiRef={canvasRef} />}
            {editorOpen && <GroupEditor />}
        </div>
    );
}
