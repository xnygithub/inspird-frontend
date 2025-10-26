import Konva from "konva";
import { attachLogic } from "../group.interactions";
import { GroupBackgroundWithUpdate, GroupWithUpdate } from "../types";


export async function hydrateGroups(root: Konva.Stage): Promise<void> {

    let groups: Konva.Group[] = [];
    groups = root.find<Konva.Group>("Group");
    groups = groups.filter((g: Konva.Group) => g.name() === 'group-wrapper');
    const transformer = root.find<Konva.Transformer>("Transformer")[0] as Konva.Transformer;

    for (const group of groups) {
        const innerGroup = group.getChildren(n => n.name()?.includes('group-content'))[0] as GroupWithUpdate;
        const title = group.getChildren(n => n.name()?.includes('group-title'))[0] as Konva.Text;
        const background = group.getChildren(n => n.name()?.includes('group-background'))[0] as GroupBackgroundWithUpdate | undefined;
        const parentLayer = group.getLayer() as Konva.Layer;

        if (!innerGroup || !title || !background || !parentLayer || !transformer) continue;


        attachLogic(innerGroup, group, title, background, parentLayer, transformer);

    };
}
