import { useCallback } from "react";
import type Konva from "konva";

const MAX_ZOOM = 1.5;
const MIN_ZOOM = 0.1;

export function useStageZoom(stageRef: React.RefObject<Konva.Stage>) {
    return useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();


        const stage = stageRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;


        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };


        let direction = e.evt.deltaY > 0 ? -1 : 1;
        if (e.evt.ctrlKey) direction = -direction; // trackpad gesture inversion


        const scaleBy = 1.2;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        if (newScale > MAX_ZOOM || newScale < MIN_ZOOM) return;


        stage.scale({ x: newScale, y: newScale });
        stage.position({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
    }, [stageRef]);
}