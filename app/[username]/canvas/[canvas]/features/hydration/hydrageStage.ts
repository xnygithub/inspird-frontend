import Konva from "konva";
import { attachStageLogic } from "../nodes/stage";

function hydrateStage(stage: Konva.Stage) {
    const contentLayer = stage.findOne<Konva.Layer>(".main-layer");
    const transformerLayer = stage.findOne<Konva.Layer>(".transformer-layer");
    const selectionBox = stage.findOne<Konva.Rect>(".selection-rect");
    const transformer = stage.findOne<Konva.Transformer>(".transformer");

    if (!contentLayer || !transformerLayer || !selectionBox || !transformer)
        throw new Error("Layers not found");

    return attachStageLogic(stage, contentLayer, transformer, transformerLayer, selectionBox);

}

export { hydrateStage };