// KonvaCanvas.tsx
import { createStage } from "./nodes/stage";
import type { CanvasServiceAPI } from "./nodes/stage";
import { useWindowSize } from "../hooks/useWindowSize";
import { loadFromLocalStorage } from "./functions/saveLoadToJson";
import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";


export type KonvaCanvasHandle = CanvasServiceAPI & {
    clear: () => void,
    saveCanvas: () => string | null
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const KonvaCanvas = forwardRef<KonvaCanvasHandle, any>(
    function KonvaCanvas(props, ref) {

        const size = useWindowSize();
        const containerRef = useRef<HTMLDivElement | null>(null);
        const serviceRef = useRef<CanvasServiceAPI | null>(null);

        useEffect(() => {
            const data = loadFromLocalStorage();
            if (!containerRef.current) throw new Error("ContainerRef not provided");

            serviceRef.current = createStage({
                container: containerRef.current,
                height: size.height,
                width: size.width,
                data,
            });

            return () => {
                serviceRef.current?.destroy();
                serviceRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
            if (!serviceRef.current) return;
            if (size.width === 0 || size.height === 0) return;

            const stage = serviceRef.current.getStage();
            if (stage) {
                stage.size({ width: size.width, height: size.height });
            }

        }, [size]);

        useImperativeHandle(ref, () => ({
            getStage: () => serviceRef.current?.getStage() ?? null,
            getContentLayer: () => serviceRef.current?.getContentLayer() ?? null,
            getTransformer: () => serviceRef.current?.getTransformer() ?? null,
            destroy: () => serviceRef.current?.destroy(),
            clear: () => serviceRef.current?.clear(),
            saveCanvas: () => serviceRef.current?.getStage()?.toJSON() ?? null,
        }));

        return (
            <div
                ref={containerRef}
                className="bg-[#292a2a]"
                style={{ width: size.width, height: size.height }}
            />
        );
    });

export default KonvaCanvas;
