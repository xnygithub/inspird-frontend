"use client";

//types
import type Konva from "konva";
import type { CanvasData, ImgItem } from "@/types/canvas";
import type { CanvasDoc } from "@/app/[username]/canvas/[canvas]/types";
import type { ProfilePostsType } from "@/types/posts";

//hooks
import { useMemo, useRef, useContext, createContext, useEffect, useState, useCallback } from "react";
import { useWindowSize } from "./hooks/useWindowSize";

//utils
import { getMediaUrl } from '@/utils/urls'
import { useStageZoom } from "./hooks/useZoom";
import { updateCanvas } from "@/app/actions/canvas";

const Ctx = createContext<{
    canvas: CanvasDoc
    parsed: CanvasData
    refs: {
        imgRef: React.RefObject<Konva.Image | null>,
        stageRef: React.RefObject<Konva.Stage | null>,
        layerRef: React.RefObject<Konva.Layer | null>,
        trRef: React.RefObject<Konva.Transformer | null>,
    }
    window: { width: number, height: number }
    images: ImgItem[]
    patchImage: (id: string, patch: Partial<ImgItem>) => void
    removeImage: (id: string) => void
    addPost: (post: ProfilePostsType[]) => void
    onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void
    resetCamera: () => void
    handleSaveCanvas: () => Promise<void>
} | undefined>(undefined);


export const CanvasProvider = ({
    canvas,
    children
}: {
    canvas: CanvasDoc,
    children: React.ReactNode
}) => {
    // Decode canvas data from database
    const parsed = useMemo(
        () => JSON.parse(canvas.data as unknown as string) as CanvasData,
        [canvas.data]
    );
    const [images, setImages] = useState<ImgItem[]>(parsed.images);

    // Initialize refs for Konva components
    const refs = {
        imgRef: useRef<Konva.Image>(null),
        stageRef: useRef<Konva.Stage>(null),
        layerRef: useRef<Konva.Layer>(null),
        trRef: useRef<Konva.Transformer>(null),
    };

    // Load initial stage state from canvas data saved in database
    useEffect(() => {
        if (!refs.stageRef.current) return;
        refs.stageRef.current.scale({ x: parsed.stage.zoom, y: parsed.stage.zoom });
        refs.stageRef.current.position({ x: parsed.stage.x, y: parsed.stage.y });
        refs.stageRef.current.batchDraw();
    }, [refs.stageRef, parsed]);

    // Get window size for canvas container
    const window = useWindowSize();
    const onWheel = useStageZoom(refs.stageRef);

    // Update image when dragged
    const patchImage = useCallback((id: string, patch: Partial<ImgItem>) => {
        setImages(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    }, []);


    // Remove image from canvas
    const removeImage = useCallback((id: string) => {
        setImages(prev => prev.filter(it => it.id !== id));
    }, []);

    // Add image to canvas
    const addImage = useCallback((post: ProfilePostsType): ImgItem => {
        return {
            id: crypto.randomUUID(),
            src: getMediaUrl(post.mediaUrl),
            postId: post.id,
            width: post.mediaWidth,
            height: post.mediaHeight,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        };
    }, []);

    // Add posts to canvas
    const addPost = (post: ProfilePostsType[]) => {
        setImages([...images, ...post.map((p) => addImage(p))]);
    };

    // Reset camera to original position and scale
    const resetCamera = () => {
        if (!refs.stageRef.current) return;
        refs.stageRef.current.position({ x: 0, y: 0 });
        refs.stageRef.current.scale({ x: 1, y: 1 });
    }

    // Handle middle moust drag
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (e.button !== 1) return;
            const stage = refs.stageRef.current;
            if (!stage) return;
            stage.stopDrag();
            stage.draggable(false);
        };
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [refs.stageRef]);

    // Handle save
    const handleSaveCanvas = async () => {
        const stage = refs.stageRef.current?.getStage();
        if (!stage) return;
        const canvasData: CanvasData = {
            schemaVersion: parsed.schemaVersion,
            stage: { zoom: stage.scaleX(), x: stage.x(), y: stage.y() },
            images: images,
        };
        const updatedCanvas = await updateCanvas(canvas.id, JSON.stringify(canvasData));
        if (!updatedCanvas) return;
    };

    return (
        <Ctx.Provider value={{
            canvas,
            parsed,
            refs,
            window,
            images,
            patchImage,
            removeImage,
            addPost,
            onWheel,
            resetCamera,
            handleSaveCanvas
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useCanvas() {
    const context = useContext(Ctx);
    if (!context) throw new Error("useCanvas must be used within CanvasProvider");
    return context;
}
