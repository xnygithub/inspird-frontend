import Konva from "konva";
import { IRect } from "konva/lib/types";
import type { GroupContent } from "../types";
import { GROUP_PADDING, GROUP_TITLE_PADDING } from "../config";



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
    });
}

export function demoteImage(node: Konva.Node) {
    node.setAttrs({
        name: "image-node",
    });
}

export function groupableBoards(
    layer: Konva.Layer
): GroupContent[] {
    return layer.find<GroupContent>(".group-content") ?? [];
}

export function addableBoards(
    node: Konva.Image,
    layer: Konva.Layer
): GroupContent[] {
    // Function to find boards that an image can be added to
    let boards: GroupContent[] = [];

    boards = layer.find(".group-content") as GroupContent[];
    if (!boards) return [];

    boards = boards.filter((board) => !board.children.includes(node));
    return boards;
}

export function filterNodes(
    nodes: Konva.Node[],
    types: string[]
): Konva.Image[] {
    return nodes.filter((node) => types.includes(node.name())) as Konva.Image[];
}

export function filterImagesNodes(
    nodes: Konva.Node[],
) {
    return nodes.filter((node) => ["image-node"].includes(node.name())) as Konva.Image[];
}


export function padBackground(
    rect: IRect,
    padding: number = GROUP_PADDING,
    titlePadding: number = GROUP_TITLE_PADDING
) {
    return {
        x: rect.x - padding,
        y: rect.y - padding - titlePadding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2 + titlePadding,
    }
}

export function filterIntersecting(
    nodes: Konva.Node[],
    box: IRect
) {
    return nodes.filter((node) =>
        Konva.Util.haveIntersection(box, node.getClientRect()));
}
