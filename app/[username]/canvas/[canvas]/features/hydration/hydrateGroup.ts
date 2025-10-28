import Konva from "konva";
import { attachLogic } from "../nodes/groupLogic";
import { GroupWithUpdate, OuterGroup } from "../types";

export async function hydrateGroups(root: Konva.Stage): Promise<void> {
    const allGroups = root.find<Konva.Group>("Group");

    const groups = allGroups.filter(
        (g: Konva.Group) => g.name() === 'group-wrapper') as OuterGroup[];
    const transformer = root.find<Konva.Transformer>("Transformer")[0];

    for (const outerNode of groups) {
        const innerNode = outerNode.getChildren(n => n.name()?.includes('group-content'))[0] as GroupWithUpdate;
        const titleNode = outerNode.getChildren(n => n.name()?.includes('group-title'))[0] as Konva.Text;
        const backGNode = outerNode.getChildren(n => n.name()?.includes('group-background'))[0] as Konva.Rect | undefined;
        const parentLayer = outerNode.getLayer() as Konva.Layer;

        if (!innerNode || !titleNode || !backGNode || !parentLayer || !transformer)
            throw new Error("Group nodes not found");
        attachLogic(innerNode, outerNode, titleNode, backGNode, parentLayer, transformer);

    };
}
