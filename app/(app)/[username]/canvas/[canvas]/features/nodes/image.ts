import Konva from "konva";
import { loadImage } from "../functions/imageLoader";
import { v4 as uuidv4 } from 'uuid';
import { demoteImage, getCenter } from "../functions/utils";
import { zoomToNode } from "../functions/zoom";
import { GroupContent, ImageNode } from "../types";
import { useStore } from "../store";

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
        name: "image-node",
        src: url,
    });

    layer.add(node);
    attachImageLogic(node, transformer, layer);
    layer.batchDraw();
    return node;
}

function attachImageLogic(
    node: Konva.Image,
    transformer: Konva.Transformer,
    layer: Konva.Layer
) {
    const {
        setMenu,
        addNodes,
        patchNode,
        deleteNodes,
        setSelectedNodes,
        appendSelectedNodes,
    } = useStore.getState();

    node.off(".image");
    const stage = node.getStage();
    if (!stage) return;
    stage.container().style.cursor = 'default';

    function isGroupInSelection(nodes: Konva.Node[]) {
        return nodes.some(n => n instanceof Konva.Group);
    }

    node.on("click.image", (e) => {
        // Select image on left click
        if (e.evt.button !== 0) return;

        if (e.evt.shiftKey) {
            // Prevent additional selection if image is in a group
            const bool = isGroupInSelection(transformer.nodes());
            if (bool) return;

            // Remove image from selection if it is already selected
            if (transformer.nodes().includes(node)) {
                transformer.nodes(transformer.nodes().filter(n => n !== node));
                setSelectedNodes(transformer.nodes());
                return;
            }
            // If above conditions are not met, add image to selection
            transformer.nodes([...transformer.nodes(), node]);
            appendSelectedNodes([node]);
        } else {
            // If shift key is not pressed, replace selection with image
            transformer.nodes([node]);
            setSelectedNodes([node]);
        }
        node.moveToTop();
    });

    node.on("dragstart.image", (e) => {
        // Move image to top of stack on drag start
        if (e.evt.button !== 0) return;
        node.moveToTop();
        stage.container().style.cursor = 'grabbing';
    });

    node.on("dragend.image", () => {
        stage.container().style.cursor = 'default';
    });

    node.on("transformend.image", () => {
        // If image is in a group, update group background
        if (!(node as ImageNode).isGrouped()) return;
        (node.getParent() as GroupContent).updateBackground();
    });

    node.on("dblclick.image", (e) => {
        // Zoom to image on double click
        if (e.evt.button !== 0) return;
        zoomToNode(e.target);
    });

    node.on("contextmenu.image", (e) => {
        setMenu("image", node);
        e.cancelBubble = true;
    });

    const isGrouped = () => {
        return node.getParent() instanceof Konva.Group;
    };

    const removeFromGroup = () => {
        const parent = node.getParent()

        if (!(parent instanceof Konva.Group)) return;
        const pos = node.getAbsolutePosition()
        node.moveTo(layer);
        node.absolutePosition({ x: pos.x, y: pos.y });
        demoteImage(node);
        patchNode(node);
        (parent as GroupContent).updateBackground();
    };


    (node as ImageNode).destroyImage = () => {
        const parent = node.getParent() as GroupContent | Konva.Layer;
        node.destroy();
        deleteNodes(node);
        if (parent instanceof Konva.Group) {
            (parent as GroupContent).updateBackground();
        }
        transformer.nodes([]);
    };

    (node as ImageNode).rotateImage = (dir: 'left' | 'right') => {
        node.rotate((dir === 'left' ? -90 : 90));
        if ((node as ImageNode).isGrouped()) {
            (node.getParent() as GroupContent).updateBackground();
        }
    };

    (node as ImageNode).flipImage = (dir: 'horizontal' | 'vertical') => {
        if (dir === 'horizontal') {
            node.scaleX(-node.scaleX());
            return;
        }
        node.scaleY(-node.scaleY());
    };

    (node as ImageNode).getAddableBoards = () => {
        let boards: GroupContent[] = [];

        boards = layer.find(".group-content") as GroupContent[];
        if (!boards) return [];

        boards = boards.filter((board) => !board.children.includes(node));
        return boards;
    };
    (node as ImageNode).removeFromGroup = removeFromGroup;
    (node as ImageNode).isGrouped = isGrouped;

    addNodes([node]);
}
export default addImage;
export { attachImageLogic };