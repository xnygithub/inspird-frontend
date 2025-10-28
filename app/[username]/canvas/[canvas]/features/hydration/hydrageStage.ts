import Konva from "konva";
import { attachLogic } from "../nodes/stageLogic";

function hydrateStage({
    stage,
}: {
    stage: Konva.Stage;
}) {
    const mainLayer = stage.getChildren(n => n.name() === ('main-layer'))[0] as Konva.Layer
    const tfLayer = stage.getChildren(n => n.name() === ('transformer-layer'))[0] as Konva.Layer
    const selectionRect = tfLayer.getChildren(n => n.name() === ('selection-rect'))[0] as Konva.Rect
    const transformer = tfLayer.getChildren(n => n.name() === ('transformer'))[0] as Konva.Transformer

    if (!mainLayer || !tfLayer || !selectionRect || !transformer)
        throw new Error("Layers not found");

    return attachLogic({ stage, mainLayer, transformer, tfLayer, selectionRect });

}

export { hydrateStage };