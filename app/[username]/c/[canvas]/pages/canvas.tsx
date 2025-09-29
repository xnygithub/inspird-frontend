"use client";
import "@/app/[username]/c/[canvas]/canvas.css";
import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import Konva from "konva";
import { Button } from "@/components/ui/button";
import URLImage from "@/app/[username]/c/[canvas]/components/image";
import { useHydrated } from "@/app/[username]/c/[canvas]/hooks/useHydrated";
import { useWindowSize } from "@/app/[username]/c/[canvas]/hooks/useWindowSize";
import { useStageZoom } from "@/app/[username]/c/[canvas]/hooks/useZoom";
import { useContextMenu } from "@/app/[username]/c/[canvas]/hooks/useMenu";
import AddPostsDialog from "@/app/[username]/c/[canvas]/components/import";
import { useUpdate } from "@/app/[username]/c/[canvas]/hooks/useUpdate";
import { updateCanvas } from "@/app/[username]/c/[canvas]/actions";
import { transformerConfig } from "@/app/[username]/c/[canvas]/config";
import CtxMenu from "@/app/[username]/c/[canvas]/components/ctx-menu";
import { AddPostProps, CanvasType, CanvasData, ImgItem } from "@/app/[username]/c/[canvas]/types";

// TODO: Investigate min/max resizing for images
export default function CanvasPageComponent({ canvas }: { canvas: CanvasType }) {

    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const hydrated = useHydrated();
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const { images, setImages, patchImage, removeImage, addImage } = useUpdate(canvas.data);
    const { position, visible, selectedId, setVisible, setSelectedId, onContextMenu } = useContextMenu();

    const imgRef = useRef<Konva.Image>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const trRef = useRef<Konva.Transformer>(null);
    // @ts-expect-error - stageRef is not always defined
    const onWheel = useStageZoom(stageRef);

    useEffect(() => {
        // Load initial stage state from canvas data saved in database
        if (!hydrated) return;
        if (!stageRef.current) return;
        stageRef.current.scale({ x: canvas.data.stage.zoom, y: canvas.data.stage.zoom });
        stageRef.current.position({ x: canvas.data.stage.x, y: canvas.data.stage.y });
        stageRef.current.batchDraw();

        // TODO: Do we need to add stageRef and data to the dependency array?
    }, [hydrated, stageRef, canvas.data]);

    // Dialogs  
    const addPost = (post: AddPostProps["post"][]) => {
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

    const resetCamera = () => {
        if (!stageRef.current) return;
        stageRef.current.position({ x: 0, y: 0 });
        stageRef.current.scale({ x: 1, y: 1 });
    }

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

    // Stop stage dragging on global mouseup to ensure it ends even if pointer leaves canvas
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button !== 1) return;
            const stage = stageRef.current;
            if (!stage) return;
            stage.stopDrag();
            stage.draggable(false);
        };
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

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
                draggable={false}
                width={windowWidth}
                height={windowHeight}
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
                            onSelect={(ref) => { ref.moveToTop(); setSelectedId(item.id); onRefClick(ref) }} />
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
                <Button onClick={resetCamera}>Reset Camera</Button>
                <Button onClick={handleSaveCanvas} >Save</Button>
                <Button onClick={() => setIsLibraryOpen(true)}> Add</Button>
            </div>
            <AddPostsDialog
                userId={canvas.owner.id}
                addPost={addPost}
                open={isLibraryOpen}
                onOpenChange={setIsLibraryOpen}
            />
        </div >
    );
}
