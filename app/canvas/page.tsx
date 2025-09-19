"use client";
import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Transformer } from "react-konva";
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
import Library from "./_components/library";

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
    const onWheel = useStageZoom(stageRef as React.RefObject<Konva.Stage>);

    const trRef = useRef<Konva.Transformer>(null);
    const imgRef = useRef<Konva.Image>(null);

    // Dialogs  
    const [open, setOpen] = useState(false);

    const onDelete = () => {
        if (!selectedId) return;
        removeImage(selectedId);
        setVisible(false);
        setSelectedId(null);
    };
    const onRefClick = (ref: Konva.Image) => {
        imgRef.current = ref;
        if (trRef.current) {
            trRef.current.nodes([ref]);
            trRef.current.getLayer()?.batchDraw();
        }
    };


    useEffect(() => {
        if (!trRef.current) return;
        // Attach transformer to selected image, or detach when none selected
        if (selectedId && imgRef.current) {
            trRef.current.nodes([imgRef.current]);
        } else {
            trRef.current.nodes([]);
        }
        trRef.current.getLayer()?.batchDraw();
    }, [selectedId])

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
                    onMouseDown={(e) => {
                        const stage = e.target.getStage();
                        if (!stage) return;
                        const clickedOnEmpty = e.target === stage;
                        if (clickedOnEmpty) {
                            setSelectedId(null);
                            setVisible(false);
                            if (trRef.current) {
                                trRef.current.nodes([]);
                                trRef.current.getLayer()?.batchDraw();
                            }
                        }
                    }}
                    onContextMenu={onContextMenu}
                >
                    <Layer ref={layerRef}>
                        {images.map((item) => (
                            <URLImage
                                item={item}
                                key={item.id}
                                onChange={(patch) => patchImage(item.id, patch)}
                                onSelect={(ref) => { setSelectedId(item.id); onRefClick(ref) }} />
                        ))}
                        <Transformer
                            ref={trRef}
                            flipEnabled={false}
                            boundBoxFunc={(oldBox, newBox) => {
                                console.log(oldBox, newBox);
                                if (newBox.width < 200) {
                                    return oldBox;
                                }
                                return newBox;
                            }}

                            rotateEnabled={false}
                            centeredScaling={true}
                            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                        />
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
                <Button onClick={() => setOpen(true)}> Add</Button>
            </Toolbar>
            <Library open={open} onOpenChange={setOpen} />
        </div >
    );
}
