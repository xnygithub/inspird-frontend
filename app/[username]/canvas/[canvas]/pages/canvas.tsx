"use client";
import React, { useState } from "react";

//konva
import { Stage, Layer, Transformer } from "react-konva";

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
    const [openCanvasMenu, setOpenCanvasMenu] = useState<boolean>(false);

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return;
        // Start panning on middle mouse
        if (e.evt && e.evt.button === 1) {
            e.evt.preventDefault();
            stage.draggable(true);
            stage.startDrag();
            return;
        }
        if (e.target === stage) {
            setOpenImageMenu(false);
            if (trRef.current) {
                trRef.current.nodes([]);
                trRef.current.getLayer()?.batchDraw();
            }
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
                        onMouseDown={handleStageMouseDown}
                        onContextMenu={(e) => {
                            if (e.target.getType() === "Shape") {
                                imageCtxMenu(e);
                                return;
                            }
                            e.evt.preventDefault();
                        }}
                    >
                        <Layer ref={layerRef}>
                            <Transformer ref={trRef} {...trConfig} />
                            {images.map((item) => <URLImage item={item} key={item.id} />)}
                        </Layer>
                    </Stage>
                </ContextMenuTrigger>
                {openImageMenu && <ImageMenu />}
                <Toolbar />
            </ContextMenu>
        </div >
    );
}
