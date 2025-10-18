"use client";
import React, { useEffect, useRef, useState } from "react";

//konva
import { Stage, Layer, Transformer, Rect } from "react-konva";

//types
import Konva from "konva";

//shadcn
// import * as ContextMenu from '@radix-ui/react-context-menu';

import URLImage from "@/app/[username]/canvas/[canvas]/components/image";
import { trConfig } from "@/app/[username]/canvas/[canvas]/config";
import { useCanvas } from "@/app/[username]/canvas/[canvas]/provider";
import { ImageMenu } from "../components/menu";
import Toolbar from "../components/toolbar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";


function attachTrRef(
    ref: Konva.Node,
    trRef: React.RefObject<Konva.Transformer>
) {
    if (!trRef.current) return;
    trRef.current.nodes([ref]);
    trRef.current.getLayer()?.batchDraw();
}

function detachTrRef(
    trRef: React.RefObject<Konva.Transformer>
) {
    if (!trRef.current) return;
    trRef.current.nodes([]);
}

export default function CanvasPage() {
    const { refs, window, images, onWheel } = useCanvas();
    const { stageRef, layerRef, trRef } = refs;
    const [openImageMenu, setOpenImageMenu] = useState<boolean>(false);

    const selectionRectRef = useRef<Konva.Rect>(null);
    const selectionStart = useRef<{ x: number; y: number } | null>(null);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return;

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
            selectionStart.current = pos;
            selectionRectRef.current?.visible(true);
            selectionRectRef.current?.setAttrs({
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
            });
            selectionRectRef.current?.getLayer()?.batchDraw();
        }
    }

    function imageCtxMenu(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getType() !== "Shape") return;
        // @ts-expect-error - fix later
        refs.imgRef.current = e.target
        // @ts-expect-error - fix later
        attachTrRef(refs.imgRef.current, trRef);
        setOpenImageMenu(true);
    }

    const handleMouseMove = (e) => {
        // Do nothing if we didn't start selection
        if (!selectionStart.current) return;

        const stage = e.target.getStage();
        const pos = stage.getRelativePointerPosition();
        if (!pos) return;

        const sx = selectionStart.current.x;
        const sy = selectionStart.current.y;
        const x = Math.min(pos.x, sx);
        const y = Math.min(pos.y, sy);
        const width = Math.abs(pos.x - sx);
        const height = Math.abs(pos.y - sy);

        selectionRectRef.current?.setAttrs({ x, y, width, height });
        selectionRectRef.current?.getLayer()?.batchDraw();
    }

    const handleMouseUp = () => {
        // Do nothing if we didn't start selection
        if (!selectionStart.current) return;

        const selBox = selectionRectRef.current!.getClientRect();

        const layer = layerRef.current!;
        const candidateNodes = layer.find<Konva.Image>('Image');
        const selectedNodes = candidateNodes.filter((n) => {
            const nodeBox = n.getClientRect();
            return Konva.Util.haveIntersection(selBox, nodeBox);
        });

        if (trRef.current) {
            trRef.current.nodes(selectedNodes);
            trRef.current.moveToTop();
            trRef.current.getLayer()?.batchDraw();
        }

        selectionStart.current = null;
        selectionRectRef.current!.visible(false);
        selectionRectRef.current!.getLayer()?.batchDraw();
    };

    console.log("rendered")

    return (
        <div className="padding-top relative bg-accent/40">
            <ContextMenu>
                <ContextMenuTrigger>
                    <Stage
                        ref={stageRef}
                        draggable={false}
                        onWheel={onWheel}
                        width={window.width}
                        height={window.height}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onContextMenu={(e) => {
                            if (e.target.getType() === "Shape") {
                                imageCtxMenu(e);
                                return;
                            }
                            e.evt.preventDefault();
                        }}
                    >
                        <Layer ref={layerRef}>
                            {images.map((item) => <URLImage item={item} key={item.id} />)}
                        </Layer>

                        <Layer>
                            <Transformer ref={trRef} {...trConfig} />
                        </Layer>
                        <Layer>
                            <Rect ref={selectionRectRef} fill="rgba(0,0,255,0.2)" visible={false} />
                        </Layer>
                    </Stage>
                </ContextMenuTrigger>
                {openImageMenu && <ImageMenu />}
                <Toolbar />
            </ContextMenu>
        </div >
    );
}
