import Konva from "konva";
import { loadImage } from "../functions/imageLoader";
import { v4 as uuidv4 } from 'uuid';
import { getCenter } from "../functions/utils";
import { zoomToNode } from "../functions/utils";
import { GroupContent } from "../types";
import { useCanvasStore } from "../store";

async function addImage(
    layer: Konva.Layer,
    transformer: Konva.Transformer,
    url: string
) {
    const imgEl = await loadImage(url);
    const layerCenter = getCenter(layer);

    // Scale image down
    const targetWidth = 200;
    const scaleFactor = targetWidth / imgEl.width;

    const newWidth = imgEl.width * scaleFactor;
    const newHeight = imgEl.height * scaleFactor;

    const node = new Konva.Image({
        x: layerCenter.x,
        y: layerCenter.y,
        offsetX: newWidth / 2,
        offsetY: newHeight / 2,
        width: newWidth,
        height: newHeight,
        draggable: true,
        image: imgEl,
        id: uuidv4(),
        _selectable: true,
        name: "image-node",
        src: url,
    });

    layer.add(node);
    attachImageLogic(node, transformer);
    layer.batchDraw();
    return node;
}

function isGroupInSelection(nodes: Konva.Node[]) {
    return nodes.some(n => n instanceof Konva.Group);
}

function attachImageLogic(
    node: Konva.Image,
    transformer: Konva.Transformer
) {
    const { setMenu, appendSelectedNodes, setSelectedNodes } = useCanvasStore.getState();
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
            appendSelectedNodes([node]);
        } else {
            transformer.nodes([node]);
            setSelectedNodes([node]);
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
            (parent as GroupContent).updateBackground();
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
export default addImage;
export { attachImageLogic };