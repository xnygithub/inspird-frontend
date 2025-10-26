import Konva from "konva";
import { attachInteractions } from "../stage.interactions";
import type { MenuType, MenuNode } from "../types";

interface Props {
    stage: Konva.Stage;
    selectedNodes: Konva.Node[];
    setMenu: (type: MenuType, node: MenuNode) => void;
}

export function hydrateStage({
    stage,
    selectedNodes,
    setMenu
}: Props) {
    const mainLayer = stage.getChildren(n => n.name() === ('main-layer'))[0] as Konva.Layer
    const transformerLayer = stage.getChildren(n => n.name() === ('transformer-layer'))[0] as Konva.Layer
    const selectionRect = transformerLayer.getChildren(n => n.name() === ('selection-rect'))[0] as Konva.Rect
    const transformer = transformerLayer.getChildren(n => n.name() === ('transformer'))[0] as Konva.Transformer

    if (!mainLayer || !transformerLayer || !selectionRect || !transformer)
        throw new Error("Layers not found");

    return attachInteractions(stage, mainLayer, transformer, transformerLayer, selectionRect, selectedNodes, setMenu);

}