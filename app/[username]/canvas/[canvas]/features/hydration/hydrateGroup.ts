import type Konva from "konva";
import { attachGroupLogic } from "../nodes/group";
import { GroupWrapper } from "../types";

export async function hydrateGroups(stage: Konva.Stage): Promise<void> {
    const groups = stage.find<GroupWrapper>(".group-wrapper");
    const transformer = stage.findOne<Konva.Transformer>(".transformer");

    for (const group of groups) {
        const innerNode = group.findOne<Konva.Group>('.group-content');
        const titleNode = group.findOne<Konva.Text>('.group-title');
        const backGNode = group.findOne<Konva.Rect>('.group-background');
        const parentLayer = group.getLayer() as Konva.Layer;

        if (!innerNode || !titleNode || !backGNode || !parentLayer || !transformer)
            throw new Error("Group nodes not found");
        attachGroupLogic(innerNode, group, titleNode, backGNode, parentLayer, transformer);
    };
}
