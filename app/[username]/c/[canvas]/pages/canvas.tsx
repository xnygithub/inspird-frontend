"use client";
import "@/app/[username]/c/[canvas]/canvas.css";
import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import Konva from "konva";
import { Button } from "@/components/ui/button";
import URLImage from "@/app/[username]/c/[canvas]/components/image";
import { useHydrated } from "@/app/[username]/c/[canvas]/hooks/useHydrated";
import { useWindowSize } from "@/app/[username]/c/[canvas]/hooks/useWindowSize";
import { useKeyHold } from "@/app/[username]/c/[canvas]/hooks/useDraggable";
import { useStageZoom } from "@/app/[username]/c/[canvas]/hooks/useZoom";
import { useContextMenu } from "@/app/[username]/c/[canvas]/hooks/useMenu";
import Library from "@/app/[username]/c/[canvas]/components/import";
import { CanvasData } from "../types";
import { useUpdate } from "../hooks/useUpdate";
import { ImgItem } from "../types";
import { GetUsersPostsResult } from "@/lib/client/posts";
import { updateCanvas } from "../actions";
import { useSetInitalStage } from "../hooks/useInit";
import { transformerConfig } from "../config";
import CtxMenu from "../components/ctx-menu";
import { CanvasDoc } from "@/app/generated/prisma";

interface CanvasPageProps {
    canvas: CanvasDoc & { data: CanvasData };
}


export default function CanvasPageComponent({ canvas }: CanvasPageProps) {

    // States
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Hooks
    const hydrated = useHydrated();
    const stageDraggable = useKeyHold("Shift");
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const { images, setImages, patchImage, removeImage, addImage } = useUpdate(canvas.data);
    const { position, visible, selectedId, setVisible, setSelectedId, onContextMenu } = useContextMenu();

    // Refs
    const imgRef = useRef<Konva.Image>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const onWheel = useStageZoom(stageRef as React.RefObject<Konva.Stage>);

    useSetInitalStage({ stageRef: stageRef as React.RefObject<Konva.Stage>, data: canvas.data, hydrated });

    // Dialogs  
    const addPost = (post: GetUsersPostsResult["posts"][]) => {
        setImages([...images, ...post.map((p) => addImage(p))]);
    };

    const onDelete = () => {
        if (!selectedId) return;
        removeImage(selectedId);
        setVisible(false);
        setSelectedId(null);
    };

    const handleSaveCanvas = async () => {
        const stage = stageRef.current?.getStage();
        if (!stage) return;
        const canvasData: CanvasData = {
            schemaVersion: canvas.data.schemaVersion,
            stage: { zoom: stage.scaleX(), x: stage.x(), y: stage.y() },
            images: images as ImgItem[],
        };
        const updatedCanvas = await updateCanvas(canvas.id, canvasData);
        if (!updatedCanvas) return;
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

    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
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
    }

    if (!hydrated) return null;

    return (
        <div id="stage-container">
            <Stage
                ref={stageRef}
                width={windowWidth}
                height={windowHeight}
                draggable={stageDraggable}
                onWheel={onWheel}
                onContextMenu={onContextMenu}
                onMouseDown={handleStageMouseDown}
            >
                <Layer ref={layerRef}>
                    {images.map((item) => (
                        <URLImage
                            item={item}
                            key={item.id}
                            onChange={(patch) => patchImage(item.id, patch)}
                            onSelect={(ref) => { setSelectedId(item.id); onRefClick(ref) }} />
                    ))}
                    <Transformer ref={trRef} {...transformerConfig} />
                </Layer>
            </Stage>
            {visible && (
                <CtxMenu position={position}>
                    <Button onClick={onDelete}>Delete</Button>
                </CtxMenu>
            )}
            <div id="stage-toolbar" >
                <Button onClick={handleSaveCanvas} >Save</Button>
                <Button onClick={() => setIsLibraryOpen(true)}> Add</Button>
            </div>
            <Library open={isLibraryOpen} onOpenChange={setIsLibraryOpen} addPost={addPost} />
        </div >
    );
}
