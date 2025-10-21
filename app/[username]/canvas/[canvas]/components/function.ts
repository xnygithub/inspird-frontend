import Konva from "konva";

export function zoomToFit(
    e: Konva.KonvaEventObject<MouseEvent>,
    stage: Konva.Stage
) {
    const evt = e.evt as MouseEvent;
    if (evt.button !== 0) return;
    if (!stage) return;
    // https://stackoverflow.com/questions/68800557/zoom-to-specific-shape-in-konva-js
    // https://codepen.io/spark25/pen/VwXvZpp
    const bound = e.target.getClientRect({ relativeTo: stage });
    if (!bound) return;
    const zoomFactor = 0.6;
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const scale = Math.min(
        stageWidth / bound.width,
        stageHeight / bound.height) * zoomFactor;

    const x = -bound.x * scale + (stageWidth - (bound.width * scale)) / 2;
    const y = -bound.y * scale + (stageHeight - (bound.height * scale)) / 2;


    stage.to({
        x: x,
        y: y,
        scaleX: scale,
        scaleY: scale,
        duration: 1,
        easing: Konva.Easings.StrongEaseOut,
    })
}