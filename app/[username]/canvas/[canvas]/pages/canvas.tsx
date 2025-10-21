"use client";
import React, { useRef, useState } from "react";

import Konva from "konva";
import { tfConfig } from "../config";
import { useCanvas } from "../provider";
import URLImage from "../components/image";
import KonvaText from "../components/text";
import GroupNode from "../components/group";
import Toolbar from "../components/toolbar";
import { ImageMenu } from "../components/menu";
import { GroupMenu } from "../components/menuGroup";
import { Stage, Layer, Transformer, Rect } from "react-konva";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useStageZoom } from "../hooks/useZoom";
import { useWindowSize } from "../hooks/useWindowSize";
import { KonvaMouseEvent } from "../types";
import GroupEditor from "../components/group-editor";


export default function CanvasPage() {
    const window = useWindowSize();
    const { refs, images, groups, texts, ctxMenu, setCtxMenu, selectedGroup } = useCanvas();
    const selRectRef = useRef<Konva.Rect>(null);
    const selStart = useRef<Konva.Vector2d | null>(null);
    const onWheel = useStageZoom(refs.stageRef);

    const handleMouseDown = (e: KonvaMouseEvent) => {
        const stage = e.target.getStage();
        if (!stage) return;
        console.log('handleMouseDown');
        setCtxMenu({ open: false, ref: null, kind: null });


        // We pan on scroll button not mb0 (left mouse button)
        if (e.evt && e.evt.button === 1) {
            e.evt.preventDefault();
            stage.draggable(true);
            stage.startDrag();
            return;
        }

        if (e.target === stage) {
            const pos = stage.getRelativePointerPosition();
            if (!pos) return;
            selStart.current = pos;
            selRectRef.current?.visible(true);
            selRectRef.current?.setAttrs({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
            });
            selRectRef.current?.getLayer()?.batchDraw();
            if (refs.tfRef.current) {
                refs.tfRef.current.nodes([]);
                refs.tfRef.current.getLayer()?.batchDraw();
            }
        }
    }

    const handleMouseMove = (e: KonvaMouseEvent) => {
        // Do nothing if we didn't start selection
        if (!selStart.current) return;

        const stage = e.target.getStage();
        if (!stage) return;
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const sx = selStart.current.x;
        const sy = selStart.current.y;
        const x = Math.min(pos.x, sx);
        const y = Math.min(pos.y, sy);
        const width = Math.abs(pos.x - sx);
        const height = Math.abs(pos.y - sy);

        selRectRef.current?.setAttrs({ x, y, width, height });
        selRectRef.current?.getLayer()?.batchDraw();
    }

    const handleMouseUp = () => {
        // Do nothing if we didn't start selection
        if (!selStart.current) return;

        const selBox = selRectRef.current!.getClientRect();

        const layer = refs.layerRef.current!;
        const candidateNodes = layer.find<Konva.Image>('Image, Group, Text');
        const selectedNodes = candidateNodes.filter((n) => {
            const nodeBox = n.getClientRect();
            return Konva.Util.haveIntersection(selBox, nodeBox);
        });

        const filteredNodes = selectedNodes.filter((n) => n.getParent() === layer);

        if (refs.tfRef.current) {
            refs.tfRef.current.nodes(filteredNodes);
            refs.tfRef.current.moveToTop();
            refs.tfRef.current.getLayer()?.batchDraw();
        }

        selStart.current = null;
        selRectRef.current!.visible(false);
        selRectRef.current!.getLayer()?.batchDraw();
    };

    const handleContextMenu = (e: KonvaMouseEvent) => {
        if (e.target.getClassName() === "Stage") {
            e.evt.preventDefault();
        }
    }

    // React.useEffect(() => {
    //     emitSceneChanged(0);
    // }, []);

    // whenever your canonical content arrays change (add/remove/update)
    // React.useEffect(() => {
    //     emitSceneChanged();
    // }, [texts, images, groups]);

    return (
        <div className="relative bg-accent/40">
            <ContextMenu >
                <ContextMenuTrigger >
                    <Stage
                        ref={refs.stageRef}
                        draggable={false}
                        onWheel={onWheel}
                        width={window.width}
                        height={window.height}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onContextMenu={handleContextMenu}>
                        <Layer ref={refs.layerRef} layerName="content">
                            {texts.map((t) => (
                                <KonvaText key={t.id} data={t} />
                            ))}
                            {groups.map((g) => (
                                <GroupNode key={g.id} group={g}>
                                    {images.filter((img) => img.parentId === g.id)
                                        .map((item) => <URLImage item={item} key={item.id} />)}
                                </GroupNode>
                            ))}
                            {images.filter((img) => !img.parentId)
                                .map((item) => <URLImage item={item} key={item.id} />)}
                        </Layer>
                        <Layer layerName="transformer">
                            <Transformer ref={refs.tfRef} {...tfConfig} />
                        </Layer>
                        <Layer layerName="selection">
                            <Rect ref={selRectRef} fill="rgba(0,0,255,0.2)" visible={false} />
                        </Layer>

                    </Stage>
                </ContextMenuTrigger>
                {ctxMenu.open && ctxMenu.kind === 'image' && <ImageMenu />}
                {ctxMenu.open && ctxMenu.kind === 'group' && <GroupMenu />}
                <Toolbar />
            </ContextMenu>

            {selectedGroup && <GroupEditor group={selectedGroup} />}
        </div >
    );
}
