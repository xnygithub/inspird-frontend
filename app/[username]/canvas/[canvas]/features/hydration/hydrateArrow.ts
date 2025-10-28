import Konva from "konva";
import { type ArrowGroup, attachLogic } from "../nodes/arrow";

function hydrateArrows(root: Konva.Stage) {
    const groups = root.find<Konva.Group>("Group");
    const arrows = groups.filter(group => group.name() === "arrow-group-node") as ArrowGroup[];
    const layer = root.getChildren(n => n.name() === "main-layer")[0] as Konva.Layer;

    for (const group of arrows) {
        const startHandle = group.getChildren(n => n.name()?.includes('start-handle'))[0] as Konva.Circle;
        const endHandle = group.getChildren(n => n.name()?.includes('end-handle'))[0] as Konva.Circle;
        const arrow = group.getChildren(n => n.name()?.includes('arrow-node'))[0] as Konva.Arrow;

        if (!startHandle || !endHandle || !arrow) continue
        attachLogic(layer, group, arrow, startHandle, endHandle);
    }
}

export { hydrateArrows };