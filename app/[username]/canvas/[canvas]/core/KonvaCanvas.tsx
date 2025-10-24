import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { CanvasService } from "./service";
import type { CanvasServiceAPI } from "./types";
import { ImageService } from "../features/images/service";

export type KonvaCanvasHandle = CanvasServiceAPI & {
    images: {
        addImage: ImageService["addImage"];
    };
    clear: () => void;
};

type Props = {
    width?: number;
    height?: number;
    className?: string;
};

const KonvaCanvas = forwardRef<KonvaCanvasHandle, Props>(
    function KonvaCanvas({ width = 800, height = 600, className }, ref
    ) {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const stageRef = useRef<CanvasService | null>(null);
        const imageSvcRef = useRef<ImageService | null>(null);

        useEffect(() => {
            if (!containerRef.current) return;

            // init core canvas
            stageRef.current = new CanvasService(containerRef.current, width, height);

            // init image service with only the layer dependency
            const layer = stageRef.current.getContentLayer();
            const stage = stageRef.current.getStage();
            const transformer = stageRef.current.getTransformer();
            if (!layer) throw new Error("Layer not initialized");
            if (!stage) throw new Error("Stage not initialized");
            if (!transformer) throw new Error("Transformer not initialized");

            imageSvcRef.current = new ImageService(layer, transformer);

            return () => {
                stageRef.current?.destroy();
                stageRef.current = null;
                imageSvcRef.current = null;
            };
        }, [width, height]);

        const clear = () => {
            const layer = stageRef.current?.getContentLayer();
            layer?.removeChildren();
            layer?.batchDraw();
        };

        useImperativeHandle(ref, () => ({
            getStage: () => stageRef.current?.getStage() ?? null,
            getContentLayer: () => stageRef.current?.getContentLayer() ?? null,
            getSelectedNodes: () => stageRef.current?.getSelectedNodes() ?? null,
            getTransformer: () => stageRef.current?.getTransformer() ?? null,
            clear,
            images: {
                addImage: (url, opts) => imageSvcRef.current!.addImage(url, opts),
            },
        }));

        return (
            <div
                ref={containerRef}
                className={className}
                style={{ width, height }} />
        )

    });

export default KonvaCanvas;
