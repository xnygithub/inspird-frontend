import Konva from "konva";
import {
    BACKGROUND_CONFIG,
    GROUP_TITLE_CONFIG,
    INNER_GROUP_CONFIG,
    OUTER_GROUP_CONFIG
} from "../config";
import {
    demoteImage,
    padBackground,
    promoteImage,
} from "../functions/utils";
import { zoomToNode } from "../functions/zoom";
import { useStore } from "../store";
import {
    GroupWrapper,
    GroupContent,
} from "../types";


function createGroup(
    layer: Konva.Layer,
    transformer: Konva.Transformer
) {
    const outerNode = new Konva.Group(OUTER_GROUP_CONFIG)
    const innerNode = new Konva.Group(INNER_GROUP_CONFIG)
    const titleNode = new Konva.Text(GROUP_TITLE_CONFIG);
    const bRectNode = new Konva.Rect(BACKGROUND_CONFIG);

    layer.add(outerNode);
    outerNode.add(innerNode, titleNode, bRectNode);

    attachGroupLogic(innerNode, outerNode, titleNode, bRectNode, layer, transformer);
    return { outerNode: outerNode as GroupWrapper, innerNode: innerNode as GroupContent };
}

function attachGroupLogic(
    innerNode: Konva.Group,
    outerNode: Konva.Group,
    titleNode: Konva.Text,
    backGNode: Konva.Rect,
    layer: Konva.Layer,
    transformer: Konva.Transformer,
) {
    const iNode = innerNode as GroupContent;
    const oNode = outerNode as GroupWrapper;
    const stage = layer.getStage();
    if (!stage) return;

    const id = crypto.randomUUID();

    iNode.off(".group");
    backGNode.off(".group");
    oNode.off(".group");

    const { setEditorOpen, setGroup, setMenu, addGroups } = useStore.getState();
    iNode.id(id);
    oNode.id(id);

    const updateBackground = () => {
        if (iNode.getChildren().length === 0) {
            deleteGroup();
            return
        };

        const border = iNode.getClientRect({ relativeTo: oNode });
        const padded = padBackground(border);
        backGNode.setAttrs(padded);
        backGNode.zIndex(0);

        const margin = 16;
        titleNode.position({
            x: padded.x + (margin * 2),
            y: padded.y + margin,
        });
        layer.batchDraw();
        transformer.nodes(transformer.nodes());
    };

    const addNodes = (nodes: Konva.Image[]) => {
        nodes.forEach((node) => {
            if (node instanceof Konva.Transformer) return;
            const abs = node.getAbsolutePosition();
            iNode.add(node as Konva.Image);
            node.setAbsolutePosition(abs);
            promoteImage(node);
        });
        updateBackground();
    };

    const removeNodes = (nodes: Konva.Image[]) => {
        nodes.forEach((node) => {
            node.moveTo(layer);
            demoteImage(node);
        });
        updateBackground();
    };

    const deleteGroup = () => {
        oNode.destroy();
        transformer.nodes([]);
        layer.batchDraw();
    };

    backGNode.on("dblclick.group", (e) => {
        if (e.evt.button !== 0 || e.target === titleNode) return;
        zoomToNode(e.target);
    });

    backGNode.on("click.group", (e) => {
        console.info("clicked group");
        oNode.moveToTop();
        setGroup(oNode);
        setEditorOpen(true);
        if (e.evt.button !== 0) return;
        transformer.nodes([oNode]);
    });

    stage.on("click.group", (e) => {
        if (!(e.target.name() === "group-background")) {
            setEditorOpen(false);
        }
    });

    backGNode.on("contextmenu.group", (e) => {
        setMenu("group", oNode);
        e.cancelBubble = true;
    });

    oNode.on("dragstart.group", () => oNode.moveToTop());

    iNode.updateBackground = updateBackground;
    iNode.addNodes = addNodes;
    iNode.removeNodes = removeNodes;
    oNode.deleteGroup = deleteGroup;

    oNode.getTitle = () => titleNode.text();
    oNode.setTitle = (text: string) => titleNode.text(text);
    oNode.getColor = () => backGNode.getAttr('fill') as string;
    oNode.setColor = (color: string) => backGNode.setAttr('fill', color);
    iNode.on("dragmove.group dragend.group", updateBackground);
    addGroups([oNode]);
}


export default createGroup;
export { attachGroupLogic };