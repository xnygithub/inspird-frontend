// KonvaCanvas.tsx
import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { CanvasServiceAPI } from "./canvas";
import { initCanvas } from "./stage";
import { loadFromLocalStorage } from "./functions/saveLoadToJson";
import type { MenuType, MenuNode } from "./types";


export type KonvaCanvasHandle = CanvasServiceAPI & {
    clear: () => void,
    saveCanvas: () => string | null
};

type Props = {
    setMenu: (type: MenuType, node: MenuNode) => void;
};

const KonvaCanvas = forwardRef<KonvaCanvasHandle, Props>(
    function KonvaCanvas({ setMenu }, ref) {
        const size = useWindowSize();
        const containerRef = useRef<HTMLDivElement | null>(null);
        const serviceRef = useRef<CanvasServiceAPI | null>(null);

        useEffect(() => {
            const data = loadFromLocalStorage();
            if (!containerRef.current) throw new Error("ContainerRef not provided");

            serviceRef.current = initCanvas({
                container: containerRef.current,
                height: size.height,
                width: size.width,
                data,
                setMenu,
            });

            return () => {
                serviceRef.current?.destroy();
                serviceRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [size]);

        useImperativeHandle(ref, () => ({
            getStage: () => serviceRef.current?.getStage() ?? null,
            getContentLayer: () => serviceRef.current?.getContentLayer() ?? null,
            getSelectedNodes: () => serviceRef.current?.getSelectedNodes() ?? [],
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
