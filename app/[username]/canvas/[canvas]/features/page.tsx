"use client";
import ImageMenu from "./ctx-menu/imageMenu";
import StageMenu from "./ctx-menu/stageMenu";
import GroupMenu from "./ctx-menu/groupMenu";
import React, { useRef, useState } from "react";
import ToolbarContainer from "./toolbar/container";
import KonvaCanvas, { KonvaCanvasHandle } from "./KonvaCanvas";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { MenuType, MenuNode } from "./types";


export default function Canvas() {
    const [menuType, setMenuType] = useState<MenuType>("stage");
    const [menuNode, setMenuNode] = useState<MenuNode>(null);
    const canvasRef = useRef<KonvaCanvasHandle>(null);

    const setMenu = (type: MenuType, node: MenuNode) => {
        setMenuType(type);
        setMenuNode(node);
    };

    return (
        <div className="padding-top">
            <ContextMenu>
                <ContextMenuTrigger>
                    <KonvaCanvas
                        ref={canvasRef}
                        setMenu={setMenu}
                    />
                </ContextMenuTrigger>
                <ContextMenuContent className="[&_*]:text-xs !animate-none no-scrollbar">
                    {menuType === "stage" &&
                        <StageMenu
                            menuType={menuType}
                            canvasRef={canvasRef}
                        />}
                    {menuType === "image" &&
                        <ImageMenu
                            canvasRef={canvasRef}
                            node={menuNode}
                        />}
                    {menuType === "group" &&
                        <GroupMenu
                            canvasRef={canvasRef}
                            node={menuNode}
                        />}
                </ContextMenuContent>
            </ContextMenu>
            <ToolbarContainer canvasRef={canvasRef} />
        </div>
    );
}
