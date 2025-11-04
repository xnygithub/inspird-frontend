import type Konva from "konva";
import { useStore } from "./store";
import createStage from "./nodes/stage";
import React, { useEffect, useRef } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

/* eslint-disable @typescript-eslint/no-explicit-any */
const KonvaCanvas = ({ data }: { data: any }) => {

    const initialized = useStore((s) => s.initialized);
    const setInitialized = useStore((s) => s.setInitialized);
    const clearStore = useStore((s) => s.clearStore);
    const divRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const size = useWindowSize();

    useEffect(() => {
        console.log("initialized", initialized);
        if (initialized) return;
        if (!divRef.current)
            throw new Error("ContainerRef not provided");


        const stage = createStage(divRef.current, size, data);
        if (!stage) return;
        setInitialized(true);

        return () => {
            // Cleanup on unmount
            stage.destroy();
            clearStore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!stageRef.current) return;
        if (size.width === 0 || size.height === 0) return;
        stageRef.current.size({
            width: size.width,
            height: size.height
        });
    }, [size]);

    return (
        <div
            ref={divRef}
            className="bg-[#1A1A1A]"
            style={{
                width: size.width,
                height: size.height
            }}
        />
    );
};

export default React.memo(KonvaCanvas);
