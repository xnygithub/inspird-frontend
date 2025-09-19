"use client";
import { useEffect } from "react";
import { CanvasData } from "@/app/[username]/c/[canvas]/types";
import Konva from "konva";

interface UseSetInitalStageProps {
    stageRef: React.RefObject<Konva.Stage>;
    data: CanvasData;
    hydrated: boolean;
}

export const useSetInitalStage = ({ stageRef, data, hydrated }: UseSetInitalStageProps) => {
    useEffect(() => {
        // Run only when hydrated
        if (!hydrated) return;
        stageRef.current.scale({ x: data.stage.zoom, y: data.stage.zoom });
        stageRef.current.position({ x: data.stage.x, y: data.stage.y });
        stageRef.current.batchDraw();

        // TODO: Do we need to add stageRef and data to the dependency array?
    }, [hydrated, stageRef, data]);
}