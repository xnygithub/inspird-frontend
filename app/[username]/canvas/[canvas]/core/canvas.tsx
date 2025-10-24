"use client";
import React, { useEffect, useRef, useState } from "react";
import KonvaCanvas, { KonvaCanvasHandle } from "./KonvaCanvas";
import { useWindowSize } from "../hooks/useWindowSize";
import { Button } from "@/components/ui/button";
import { KonvaGroup } from "../features/groups/service";

export default function Canvas() {
    const canvasRef = useRef<KonvaCanvasHandle>(null);
    const [hydrated, setHydrated] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        setHydrated(true);
    }, []);

    const addRandom = async () => {
        await canvasRef.current?.images.addImage("https://picsum.photos/320/200", {
            x: Math.random() * 500,
            y: Math.random() * 300,
        });
    };
    if (!hydrated) return null;

    const handleGetSelectedNodes = () => {
        const selectedNodes = canvasRef.current?.getSelectedNodes();
        console.log("selectedNodes", selectedNodes);
    };

    const handleCreateGroup = () => {
        const selectedNodes = canvasRef.current?.getSelectedNodes();
        if (!selectedNodes) return;
        const layer = canvasRef.current?.getContentLayer();
        if (!layer) return;
        KonvaGroup(layer, selectedNodes);
    };

    return (
        <div className="padding-top">
            <KonvaCanvas
                ref={canvasRef}
                width={width}
                height={height}
                className="bg-gray-500/20"
            />
            <div className="right-1/2 bottom-4 absolute flex gap-2 bg-red-500 -translate-x-1/2">
                <Button onClick={addRandom}>Add Image</Button>
                <Button onClick={() => canvasRef.current?.clear()}>Clear</Button>
                <Button onClick={handleGetSelectedNodes}>Get Selected Nodes</Button>
                <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
        </div>
    );
}
