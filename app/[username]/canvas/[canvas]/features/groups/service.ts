// features/groups/service.ts
import Konva from "konva";

export function KonvaGroup(
    layer: Konva.Layer,
    nodes: Konva.Node[]
) {
    // create group & add to layer first (so relativeTo works)
    const outer = new Konva.Group({ draggable: true, name: "group-outer" });
    const inner = new Konva.Group({ name: "group-inner" });
    layer.add(outer);
    outer.add(inner);

    // background rect lives inside the group, non-interactive
    const bg = new Konva.Rect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: "rgba(0,0,0,0.5)",
        listening: true,
        name: "group-bg",
    });
    outer.add(bg);

    nodes.forEach((n) => {
        if (n instanceof Konva.Transformer) return;
        const abs = n.getAbsolutePosition();
        inner.add(n as Konva.Shape);
        n.setAbsolutePosition(abs);
    });

    const updateBg = () => {
        const r = inner.getClientRect({
            relativeTo: outer,
            skipStroke: true,
            skipShadow: true,
        });
        const pad = 10;
        bg.setAttrs({
            x: r.x - pad,
            y: r.y - pad,
            width: r.width + pad * 2,
            height: r.height + pad * 2,
        });
        bg.zIndex(0);
        layer.batchDraw();
    };
    updateBg();
    inner.on("dragmove dragend", updateBg);

    return outer;
}
