// canvas/core/CanvasService.ts
import Konva from "konva";

export class CanvasService {
    private stage: Konva.Stage | null = null;
    private contentLayer: Konva.Layer | null = null;
    private transformerLayer: Konva.Layer | null = null;
    private transformer: Konva.Transformer | null = null;
    private selectedNodes: Konva.Node[] = [];

    constructor(container: HTMLDivElement, width: number, height: number) {
        this.stage = new Konva.Stage({ container, width, height });

        // content
        this.contentLayer = new Konva.Layer();
        this.stage.add(this.contentLayer);

        // transformer/ui layer
        this.transformerLayer = new Konva.Layer();
        this.transformer = new Konva.Transformer();
        this.transformerLayer.add(this.transformer);
        this.stage.add(this.transformerLayer);

        // selection rectangle (drawn on UI layer, non-interactive)
        const selectionRect = new Konva.Rect({
            fill: "rgba(0,0,255,0.1)",
            stroke: "rgba(0,0,255,0.6)",
            dash: [4, 4],
            visible: false,
            listening: false,
        });
        this.transformerLayer.add(selectionRect);

        // minimal marquee selection
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        const stage = this.stage;
        const uiLayer = this.transformerLayer;
        const content = this.contentLayer;
        const tr = this.transformer;

        stage.on("mousedown.select", (e) => {
            if (e.target !== stage) return; // only start on empty space

            if (e.target instanceof Konva.Group) {
                return;
            }
            console.log("e.target", e.target);
            const p = stage.getPointerPosition(); if (!p) return;
            x1 = x2 = p.x; y1 = y2 = p.y;
            selectionRect.setAttrs({ x: x1, y: y1, width: 0, height: 0, visible: true });
            uiLayer.batchDraw();
        });

        stage.on("mousemove.select", () => {
            if (!selectionRect.visible()) return;
            const p = stage.getPointerPosition(); if (!p) return;
            x2 = p.x; y2 = p.y;
            selectionRect.setAttrs({
                x: Math.min(x1, x2),
                y: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
            });
            uiLayer.batchDraw();
        });

        stage.on("mouseup.select", () => {
            if (!selectionRect.visible()) return;
            const box = selectionRect.getClientRect();
            selectionRect.visible(false);
            uiLayer.batchDraw();

            // pick anything named "selectable" on the content layer
            const selected = content.find(".selectable").filter((n) =>
                Konva.Util.haveIntersection(box, n.getClientRect()));
            this.selectedNodes = selected;
            tr.nodes(this.selectedNodes);
            uiLayer.batchDraw();
        });
    }

    destroy() {
        this.stage?.destroy();
        this.stage = null;
        this.contentLayer = null;
        this.transformerLayer = null;
        this.transformer = null;
    }

    getStage() { return this.stage; }
    getContentLayer() { return this.contentLayer; }
    getTransformer() { return this.transformer; }
    getSelectedNodes() { return this.selectedNodes; }
}
