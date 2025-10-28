import Konva from "konva";
import { zoomToNode } from "../functions/utils";
import { GroupWithUpdate } from "../types";
import { useCanvasStore } from "../store";

function isGroupInSelection(nodes: Konva.Node[]) {
    return nodes.some(n => n instanceof Konva.Group);
}

export function attachLogic(
    node: Konva.Image,
    transformer: Konva.Transformer
) {
    const { setMenu } = useCanvasStore.getState();
    node.off(".image");

    const stage = node.getStage();
    if (!stage) return;
    stage.container().style.cursor = 'default';

    node.on("click.image", (e) => {
        if (e.evt.button !== 0) return;

        if (e.evt.shiftKey) {
            const res = isGroupInSelection(transformer.nodes());
            if (res) return;
            transformer.nodes([...transformer.nodes(), node]);
        } else {
            transformer.nodes([node]);
        }
        node.moveToTop();
    });

    node.on("dragstart.image", () => {
        node.moveToTop();
        stage.container().style.cursor = 'grabbing';
    });

    node.on("dragend.image", () => {
        stage.container().style.cursor = 'default';
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

    node.on("contextmenu.image", (e) => {
        setMenu("image", node);
        e.cancelBubble = true;
    });
}
