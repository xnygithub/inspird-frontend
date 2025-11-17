import Konva from "konva";
import { attachStageLogic } from "../nodes/stage";
import { useStore } from "../store";

function hydrateStage(stage: Konva.Stage) {

    const { setStage, setTransformer, setContentLayer } = useStore.getState();
    const contentLayer = stage.findOne<Konva.Layer>(".main-layer");
    const transformerLayer = stage.findOne<Konva.Layer>(".transformer-layer");
    const selectionBox = stage.findOne<Konva.Rect>(".selection-rect");
    const transformer = stage.findOne<Konva.Transformer>(".transformer");

    if (!contentLayer || !transformerLayer || !selectionBox || !transformer)
        throw new Error("Layers not found");

    setStage(stage);
    setTransformer(transformer);
    setContentLayer(contentLayer);

    attachStageLogic(stage, contentLayer, transformer, transformerLayer, selectionBox);
}

export { hydrateStage };