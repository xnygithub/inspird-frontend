import Konva from "konva";
import { zoomToNode } from "./functions/utils";
import { GroupWithUpdate } from "./types";

export function attachImageInteractions(
    node: Konva.Image,
    transformer: Konva.Transformer
) {
    node.off("click.image dragstart.image dblclick.image");

    node.on("click.image", (e) => {
        if (e.evt.button !== 0) return;
        node.moveToTop();
        transformer.nodes([node]);
        node.getLayer()?.batchDraw();
    });

    node.on("dragstart.image", () => {
        node.moveToTop();
    });

    node.on("transformend.image", () => {
        const parent = node.getParent();
        if (parent instanceof Konva.Group) {
            (parent as GroupWithUpdate).updateBackground();
        }
    });

    node.on("dblclick.image", (e) => {
        if (e.evt.button !== 0) return;
        const stage = node.getStage() as Konva.Stage;
        zoomToNode(e, stage);
    });
}
