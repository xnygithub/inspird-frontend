"use client";
import ImageMenu from "../components/menuImage";
import StageMenu from "../components/menuStage";
import GroupMenu from "../components/menuGroup";
import LayerView from "../components/layerView";
import ToolbarContainer from "../components/rootToolbar";
import KonvaCanvas from "./canvas";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Canvas({ data }: { data: any }) {

    return (
        <div className="padding-top">
            <ContextMenu>
                <ContextMenuTrigger>
                    <KonvaCanvas data={data} />
                </ContextMenuTrigger>
                <ContextMenuContent className="[&_*]:text-xs !animate-none no-scrollbar">
                    <StageMenu />
                    <ImageMenu />
                    <GroupMenu />
                </ContextMenuContent>
            </ContextMenu>
            <LayerView />
            <ToolbarContainer />
        </div>
    );
}
