import Konva from "konva";
import type { GroupWithUpdate } from "../types";

export function zoomToNode(
    e: Konva.KonvaEventObject<MouseEvent>,
    stage: Konva.Stage
) {
    if (e.evt.button !== 0) return;
    if (!stage) return;
    // https://stackoverflow.com/questions/68800557/zoom-to-specific-shape-in-konva-js
    // https://codepen.io/spark25/pen/VwXvZpp
    const bound = e.target.getClientRect({ relativeTo: stage });
    const zoomFactor = 0.2;
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

export function getCenter(layer: Konva.Layer) {
    const stage = layer.getStage();
    const screenCenter = { x: stage.width() / 2, y: stage.height() / 2 };
    const inv = layer.getAbsoluteTransform().copy().invert();
    const layerCenter = inv.point(screenCenter);
    return layerCenter;
}

export function promoteImage(node: Konva.Node) {
    node.setAttrs({
        name: "group-image-node",
        _selectable: false,
    });
}

export function demoteImage(node: Konva.Node) {
    node.setAttrs({
        name: "image-node",
        _selectable: true,
    });
}

export function addableBoards(
    node: Konva.Image,
    layer: Konva.Layer
) {
    // Function to find boards that an image can be added to
    let boards: GroupWithUpdate[] = [];

    boards = layer.find(".group-content") as GroupWithUpdate[];
    if (!boards) return [];

    boards = boards.filter((board) => !board.children.includes(node));
    return boards;
}

export function filterNodes(
    nodes: Konva.Node[],
    types: string[] = ["image-node"]
): Konva.Image[] {
    return nodes.filter((node) => types.includes(node.name())) as Konva.Image[];
}
