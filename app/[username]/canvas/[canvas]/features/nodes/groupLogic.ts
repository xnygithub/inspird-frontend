import Konva from "konva";
import {
    demoteImage,
    padBackground,
    promoteImage,
    zoomToNode
} from "../functions/utils";
import { GroupWithUpdate as InnerGroup, OuterGroup } from "../types";
import { useCanvasStore } from "../store";

export function attachLogic(
    innerNode: InnerGroup,
    outerNode: OuterGroup,
    titleNode: Konva.Text,
    backGNode: Konva.Rect,
    layer: Konva.Layer,
    transformer: Konva.Transformer,
) {
    innerNode.off(".group");
    backGNode.off(".group");
    outerNode.off(".group");

    const { setEditorOpen, setGroup, setMenu } = useCanvasStore.getState();

    const updateBackground = () => {
        if (innerNode.getChildren().length === 0) {
            deleteGroup();
            return
        };

        const border = innerNode.getClientRect({ relativeTo: outerNode });
        const padded = padBackground(border);
        backGNode.setAttrs(padded);
        backGNode.zIndex(0);

        const margin = 8;
        titleNode.position({
            x: padded.x + margin,
            y: padded.y + margin,
        });
        layer.batchDraw();
        transformer.nodes([]);
    };

    const addNodes = (nodes: Konva.Image[]) => {
        nodes.forEach((node) => {
            if (node instanceof Konva.Transformer) return;
            const abs = node.getAbsolutePosition();
            innerNode.add(node as Konva.Shape);
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
        outerNode.destroy();
        transformer.nodes([]);
        layer.batchDraw();
    };

    backGNode.on("dblclick.group", (e) => {
        if (e.evt.button !== 0 || e.target === titleNode) return;
        const stage = layer.getStage();
        zoomToNode(e, stage);
    });

    backGNode.on("click.group", (e) => {
        outerNode.moveToTop();
        setGroup(outerNode);
        setEditorOpen(true);
        if (e.evt.button !== 0) return;
        transformer.nodes([outerNode]);
    });

    backGNode.on("contextmenu.group", (e) => {
        setMenu("group", outerNode);
        e.cancelBubble = true;
    });

    outerNode.on("dragstart.group", () => {
        outerNode.moveToTop();
    });

    const updateText = (text: string) => {
        titleNode.text(text);
    };

    const getText = () => titleNode.text();
    const getColor = () => backGNode.getAttr('fill') as string;
    const setColor = (color: string) => backGNode.setAttr('fill', color);

    innerNode.updateBackground = updateBackground;
    innerNode.addNodes = addNodes;
    innerNode.removeNodes = removeNodes;
    outerNode.updateText = updateText;
    outerNode.getGroupName = getText;
    outerNode.deleteGroup = deleteGroup;
    outerNode.getColor = getColor;
    outerNode.setColor = setColor;
    innerNode.on("dragmove.group dragend.group", updateBackground);
}
