import Konva from "konva";
import {
    BACKGROUND_CONFIG,
    GROUP_TITLE_CONFIG,
    INNER_GROUP_CONFIG,
    OUTER_GROUP_CONFIG
} from "./config";
import { GroupWithUpdate, OuterGroup } from "./types";
import { attachLogic } from "./group.interactions";

export function createGroup(
    layer: Konva.Layer,
    transformer: Konva.Transformer
) {
    const outerNode = new Konva.Group(OUTER_GROUP_CONFIG) as OuterGroup;
    const innerNode = new Konva.Group(INNER_GROUP_CONFIG) as GroupWithUpdate;
    const titleNode = new Konva.Text(GROUP_TITLE_CONFIG);
    const bRectNode = new Konva.Rect(BACKGROUND_CONFIG);

    layer.add(outerNode);
    outerNode.add(innerNode, titleNode, bRectNode);

    attachLogic(innerNode, outerNode, titleNode, bRectNode, layer, transformer);
    return { outerNode, innerNode };
}