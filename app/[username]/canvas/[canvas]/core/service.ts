// canvas/core/CanvasService.ts
import Konva from "konva";
import { TRANSFORMER_CONFIG } from "./config";

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
        this.transformer = new Konva.Transformer(TRANSFORMER_CONFIG);
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

        let isPanning = false;
        let lastPointerPosition: { x: number, y: number } | null = null;

        stage.on('mousedown.pan', (e) => {
            if (e.evt.button !== 1) return;

            isPanning = true;
            lastPointerPosition = stage.getPointerPosition();
            stage.container().style.cursor = 'grabbing';

            e.evt.preventDefault();
        });

        stage.on('mousemove.pan', () => {
            if (!isPanning) return;
            const pos = stage.getPointerPosition();
            if (!pos || !lastPointerPosition) return;

            const dx = pos.x - lastPointerPosition.x;
            const dy = pos.y - lastPointerPosition.y;

            stage.x(stage.x() + dx);
            stage.y(stage.y() + dy);

            lastPointerPosition = pos;
            stage.batchDraw();
        });

        const stopPan = () => {
            if (!isPanning) return;
            isPanning = false;
            lastPointerPosition = null;
            stage.container().style.cursor = 'default';
        };

        stage.on('mouseup.pan', stopPan);
        stage.on('mouseleave.pan', stopPan);

        stage.on("mousedown.select", (e) => {
            if (e.target !== stage) return;

            if (e.target instanceof Konva.Group) {
                return;
            }

            if (e.evt.button !== 0) return;

            const p = stage.getRelativePointerPosition(); if (!p) return;
            x1 = x2 = p.x; y1 = y2 = p.y;
            selectionRect.setAttrs({ x: x1, y: y1, width: 0, height: 0, visible: true });
            uiLayer.batchDraw();
        });

        stage.on("mousemove.select", () => {
            if (!selectionRect.visible()) return;
            const p = stage.getRelativePointerPosition(); if (!p) return;
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


        stage.on('wheel', (e) => {
            e.evt.preventDefault();

            const oldScale = stage.scaleX();
            const scaleBy = 1.05;
            const direction = e.evt.deltaY < 0 ? 1 : -1;

            // Optional: clamp
            const minScale = 0.2;
            const maxScale = 5;

            const newScaleRaw = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            const newScale = Math.max(minScale, Math.min(maxScale, newScaleRaw));

            // Viewport center in screen coords
            const center = { x: stage.width() / 2, y: stage.height() / 2 };

            // Convert that center to stage/world coords using the *current* transform
            const centerInStage = {
                x: (center.x - stage.x()) / oldScale,
                y: (center.y - stage.y()) / oldScale,
            };

            // Apply scale
            stage.scale({ x: newScale, y: newScale });

            // Reposition so the same world point stays under the viewport center
            const newPos = {
                x: center.x - centerInStage.x * newScale,
                y: center.y - centerInStage.y * newScale,
            };
            stage.position(newPos);

            stage.batchDraw();
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
