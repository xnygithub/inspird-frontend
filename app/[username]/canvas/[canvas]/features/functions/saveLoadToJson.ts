import type Konva from "konva";
import { KonvaCanvasHandle } from "../canvas";

const saveToLocalStorage = (stage: Konva.Stage) => {
    const data = stage.toJSON();
    localStorage.setItem("canvas-data", JSON.stringify(data));
}

const loadFromLocalStorage = () => {
    const data = localStorage.getItem("canvas-data");
    if (!data) return null;
    return JSON.parse(data);
}

const saveJson = async (ref: KonvaCanvasHandle, canvasDocId: string) => {
    const stage = ref.getStage();
    if (!stage) throw Error("Failed to save, stage not present")
    const data = stage.toJSON();
    await fetch('/api/konva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, canvasDocId }),
    })
}


export { saveToLocalStorage, loadFromLocalStorage, saveJson };