import Konva from "konva";
import { demoteImage, promoteImage, zoomToNode } from "./functions/utils";
import { GroupWithUpdate as InnerGroup, OuterGroup } from "./types";
import { IRect } from "konva/lib/types";
import { GROUP_PADDING } from "./config";

export function padBackground(rect: IRect, padding: number = GROUP_PADDING) {
    return {
        x: rect.x - padding,
        y: rect.y - padding - 20,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2 + 20,
    }
}

export function attachLogic(
    innerNode: InnerGroup,
    outerNode: OuterGroup,
    titleNode: Konva.Text,
    bRectNode: Konva.Rect,
    layer: Konva.Layer,
    transformer: Konva.Transformer,
) {
    innerNode.off("dblclick.group click.group dragstart.group");

    const updateBackground = () => {
        if (innerNode.getChildren().length === 0) {
            deleteGroup();
            return
        };

        const border = innerNode.getClientRect({ relativeTo: outerNode });
        const padded = padBackground(border);
        bRectNode.setAttrs(padded);
        bRectNode.zIndex(0);

        const margin = 8;
        titleNode.position({
            x: padded.x + margin,
            y: padded.y + margin,
        });
        layer.batchDraw();
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

    bRectNode.on("dblclick.group", (e) => {
        if (e.evt.button !== 0 || e.target === titleNode) return;
        const stage = layer.getStage();
        zoomToNode(e, stage);
    });

    bRectNode.on("click.group", (e) => {
        outerNode.moveToTop();
        if (e.evt.button !== 0) return;
        transformer.nodes([outerNode]);
    });

    outerNode.on("dragstart.group", () => {
        outerNode.moveToTop();
    });

    const updateText = (text: string) => {
        titleNode.text(text);
    };

    const getText = () => titleNode.text();

    innerNode.updateBackground = updateBackground;
    innerNode.addNodes = addNodes;
    innerNode.removeNodes = removeNodes;
    innerNode.updateText = updateText;
    innerNode.getGroupName = getText;
    outerNode.deleteGroup = deleteGroup;
    innerNode.on("dragmove.group dragend.group", updateBackground);
}
