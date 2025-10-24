// features/groups/service.ts
import Konva from "konva";
import { zoomToFit } from "../../core/utils";
import { IRect } from "konva/lib/types";
import { GROUP_CONFIG, GROUP_PADDING } from "../../core/config";
import { GroupWithUpdate } from "../../core/types";

const pad = (rect: IRect, padding: number = GROUP_PADDING) => {
    return {
        x: rect.x - padding,
        y: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
    }
}

export function KonvaGroup(
    layer: Konva.Layer,
    nodes: Konva.Node[],
    transformer?: Konva.Transformer
) {
    const outer = new Konva.Group({ draggable: true, name: "group-outer" });
    const inner = new Konva.Group({ name: "group-inner" }) as GroupWithUpdate;
    layer.add(outer);
    outer.add(inner);

    const bg = new Konva.Rect(GROUP_CONFIG);
    outer.add(bg);

    nodes.forEach((n) => {
        if (n instanceof Konva.Transformer) return;
        const abs = n.getAbsolutePosition();
        inner.add(n as Konva.Shape);
        n.setAbsolutePosition(abs);
    });

    const updateBg = () => {
        const border = inner.getClientRect({ relativeTo: outer });
        const padded = pad(border);
        bg.setAttrs(padded);
        bg.zIndex(0);
        layer.batchDraw();
    };

    outer.on("dblclick", (e) => {
        if (e.evt.button !== 0) return;
        const stage = layer.getStage();
        zoomToFit(e, stage);
    });

    updateBg();
    inner.updateBg = updateBg;
    inner.on("dragmove dragend add remove", updateBg);

    return outer;
}
