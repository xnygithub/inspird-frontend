import Konva from "konva";
import { attachArrowLogic } from "../nodes/arrow";

function hydrateArrows(stage: Konva.Stage) {
    const arrows = stage.find<Konva.Group>(".arrow-group-node");
    const layer = stage.findOne<Konva.Layer>(".main-layer");
    if (!layer) throw new Error("Layer not found");

    for (const group of arrows) {
        const startHandle = group.findOne<Konva.Circle>(".start-handle");
        const endHandle = group.findOne<Konva.Circle>(".end-handle");
        const arrow = group.findOne<Konva.Arrow>(".arrow-node");

        if (!startHandle || !endHandle || !arrow) {
            throw new Error("Failed to hydrate arrows");
        }
        attachArrowLogic(layer, group, arrow, startHandle, endHandle);
    }
}

export { hydrateArrows };