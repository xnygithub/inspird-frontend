"use client";
import React, { useRef, useState } from "react";
import KonvaCanvas, { KonvaCanvasHandle } from "./KonvaCanvas";
import { useWindowSize } from "../hooks/useWindowSize";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import ImageMenu from "../features/menu/image";
import StageMenu from "../features/menu/stage";
import Konva from "konva";
type MenuType = "image" | "stage";

export default function Canvas() {
    const [menuType, setMenuType] = useState<MenuType>("stage");
    const [menuTarget, setMenuTarget] = useState<Konva.Node | null>(null);
    const canvasRef = useRef<KonvaCanvasHandle>(null);
    const { width, height } = useWindowSize();


    return (
        <div className="padding-top">
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div onContextMenuCapture={(e) => {
                        const stage = canvasRef.current?.getStage();
                        if (!stage) return;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        stage.setPointersPositions(e.nativeEvent as any);
                        const p = stage.getPointerPosition();
                        const hit = p ? stage.getIntersection(p) : null;

                        setMenuType(hit && (hit.hasName("image") || hit.getClassName() === "Image")
                            ? "image"
                            : "stage");
                        setMenuTarget(hit as Konva.Node);
                    }}
                    >
                        <KonvaCanvas
                            ref={canvasRef}
                            width={width}
                            height={height}
                            className="bg-gray-500/20"
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="!animate-none">
                    {menuType === "stage" &&
                        <StageMenu
                            menuType={menuType}
                            canvasRef={canvasRef}
                        />}
                    {menuType === "image" &&
                        <ImageMenu
                            menuType={menuType}
                            canvasRef={canvasRef}
                            menuTarget={menuTarget}
                        />}
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}
