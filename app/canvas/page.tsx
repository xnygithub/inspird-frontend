"use client";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { Button } from "@/components/ui/button";
import { Upload, Toolbar } from "@/app/canvas/_components/toolbar";
import { Menu, Delete } from "@/app/canvas/_components/menu";
import URLImage from "@/app/canvas/_components/image";
import { useHydrated } from "@/app/canvas/hooks/hydrated";
import { useWindowSize } from "@/app/canvas/hooks/window";
import { useKeyHold } from "./hooks/draggable";
import { useLocalDoc } from "./hooks/storage";
import { useStageZoom } from "./hooks/zoom";
import { useContextMenu } from "./hooks/menu";


export default function CanvasPage() {

    // Hooks
    const hydrated = useHydrated();
    const stageDraggable = useKeyHold("Shift");
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const { images, setImages, save, load, patchImage, removeImage } = useLocalDoc();
    const { position, visible, selectedId, setVisible, setSelectedId, onContextMenu } = useContextMenu();

    // Refs
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const onWheel = useStageZoom(stageRef);


    const onDelete = () => {
        if (!selectedId) return;
        removeImage(selectedId);
        setVisible(false);
        setSelectedId(null);
    };

    if (!hydrated) return null;

    return (
        <div className="bg-gray-500/20">
            <div>
                <Stage
                    draggable={stageDraggable}
                    ref={stageRef}
                    width={windowWidth}
                    height={windowHeight}
                    onWheel={onWheel}
                    onContextMenu={onContextMenu}
                >
                    <Layer ref={layerRef}>
                        {images.map((item) => (
                            <URLImage
                                item={item}
                                key={item.id}
                                onSelect={() => setSelectedId(item.id)}
                                onChange={(patch) => patchImage(item.id, patch)}
                            />
                        ))}
                    </Layer>
                </Stage>
                {visible && (
                    <Menu menuPosition={position}>
                        <Delete handleDelete={onDelete} />
                    </Menu>
                )}
            </div>
            <Toolbar>
                <Upload setImages={setImages} />
                <Button onClick={save}>Save</Button>
                <Button onClick={load}>Load</Button>
            </Toolbar>
        </div >
    );
}
