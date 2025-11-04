import Konva from "konva";

export function zoomToNode(
    node: Konva.Node,
) {
    const stage = node.getStage();
    if (!stage) return;
    // https://stackoverflow.com/questions/68800557/zoom-to-specific-shape-in-konva-js
    // https://codepen.io/spark25/pen/VwXvZpp
    const bound = node.getClientRect({ relativeTo: stage });
    const zoomFactor = 0.3;
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const scale = Math.min(
        stageWidth / bound.width,
        stageHeight / bound.height) * zoomFactor;

    const x = -bound.x * scale + (stageWidth - (bound.width * scale)) / 2;
    const y = -bound.y * scale + (stageHeight - (bound.height * scale)) / 2;

    stage.to({
        x: x, y: y,
        scaleX: scale, scaleY: scale,
        duration: 1,
        easing: Konva.Easings.StrongEaseOut,
    });
}

export function zoomToAllNodes(
    layer: Konva.Layer
) {
    if (!layer) return;
    const stage = layer.getStage();
    if (!stage) return;

    const nodes = layer.find('Shape, Group');

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;


    nodes.forEach((node: Konva.Node) => {
        const box = node.getClientRect({ relativeTo: stage });
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    });

    const bound = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };

    const zoomFactor = 0.6;
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const scale = Math.min(
        stageWidth / bound.width,
        stageHeight / bound.height
    ) * zoomFactor;


    const x = -bound.x * scale + (stageWidth - bound.width * scale) / 2;
    const y = -bound.y * scale + (stageHeight - bound.height * scale) / 2;


    stage.to({
        x, y,
        scaleX: scale,
        scaleY: scale,
        duration: 2,
        easing: Konva.Easings.StrongEaseOut,
    });
}