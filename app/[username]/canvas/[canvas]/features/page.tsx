"use client";
import ImageMenu from "../components/menu/image";
import StageMenu from "../components/menu/stage";
import GroupMenu from "../components/menu/group";
import React, { useRef } from "react";
import ToolbarContainer from "../components/toolbar";
import KonvaCanvas, { KonvaCanvasHandle } from "./canvas";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import GroupEditor from "../components/editors/group";
import { useCanvasStore } from "./store";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Canvas({ data }: { data: any }) {
    const canvasRef = useRef<KonvaCanvasHandle>(null);
    const { editorOpen, menu, initialized } = useCanvasStore();
    return (
        <div className="padding-top">
            <ContextMenu>
                <ContextMenuTrigger>
                    <KonvaCanvas ref={canvasRef} data={data} />
                </ContextMenuTrigger>
                <ContextMenuContent className="[&_*]:text-xs !animate-none no-scrollbar">
                    {menu.type === "stage" && <StageMenu canvasRef={canvasRef} />}
                    {menu.type === "image" && <ImageMenu canvasRef={canvasRef} />}
                    {menu.type === "group" && <GroupMenu />}
                </ContextMenuContent>
            </ContextMenu>
            {initialized && <ToolbarContainer apiRef={canvasRef} />}
            {editorOpen && <GroupEditor />}
        </div>
    );
}
