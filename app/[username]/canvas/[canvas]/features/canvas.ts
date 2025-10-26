// canvas/core/createCanvasService.ts
import Konva from "konva";
import { SELECTION_RECT_CONFIG, TRANSFORMER_CONFIG } from "./config";

export interface CanvasServiceAPI {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getTransformer: () => Konva.Transformer | null;
    getSelectedNodes: () => Konva.Node[];
    clear: () => void;
    destroy: () => void;
}

interface Props {
    container: HTMLDivElement;
    window: { width: number; height: number };
    setMenu: (type: "image" | "group" | "stage", node: Konva.Image | Konva.Rect | null) => void;
}

export function createCanvasService({
    container,
    window,
    setMenu
}:
    Props
): CanvasServiceAPI {

    // Define as lets so we can assign/reassign values later
    let stage: Konva.Stage | null
    let nodeContentLayer: Konva.Layer | null
    let transformerLayer: Konva.Layer | null
    let transformer: Konva.Transformer | null
    let selectionRect: Konva.Rect | null
    let selectedNodes: Konva.Node[] = [];

    stage = new Konva.Stage({
        container,
        width: window.width,
        height: window.height
    });
    nodeContentLayer = new Konva.Layer();
    transformerLayer = new Konva.Layer();
    transformer = new Konva.Transformer(TRANSFORMER_CONFIG);
    selectionRect = new Konva.Rect(SELECTION_RECT_CONFIG);

    stage.add(nodeContentLayer);
    stage.add(transformerLayer);
    transformerLayer.add(transformer);
    transformerLayer.add(selectionRect);


    // --- minimal marquee selection & panning
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    let isPanning = false;
    let lastPointerPosition: { x: number; y: number } | null = null;

    // Use namespaced events so cleanup is trivial
    stage.on("mousedown.pan", (e) => {
        if (e.evt.button !== 1) return; // middle mouse
        isPanning = true;
        lastPointerPosition = stage!.getPointerPosition();
        stage!.container().style.cursor = "grabbing";
        e.evt.preventDefault();
    });

    stage.on("mousemove.pan", () => {
        if (!isPanning) return;
        const pos = stage!.getPointerPosition();
        if (!pos || !lastPointerPosition) return;
        const dx = pos.x - lastPointerPosition.x;
        const dy = pos.y - lastPointerPosition.y;
        stage!.x(stage!.x() + dx);
        stage!.y(stage!.y() + dy);
        lastPointerPosition = pos;
        stage!.batchDraw();
    });

    const stopPan = () => {
        if (!isPanning) return;
        isPanning = false;
        lastPointerPosition = null;
        stage!.container().style.cursor = "default";
    };

    stage.on("mouseup.pan", stopPan);
    stage.on("mouseleave.pan", stopPan);

    stage.on("mousedown.select", (e) => {
        if (e.target !== stage) return;
        if (e.target instanceof Konva.Group) return;
        if (e.evt.button !== 0) return; // left mouse
        const p = stage!.getRelativePointerPosition();
        if (!p) return;
        x1 = x2 = p.x; y1 = y2 = p.y;
        selectionRect!.setAttrs({ x: x1, y: y1, width: 0, height: 0, visible: true });
        transformerLayer!.batchDraw();
    });

    stage.on("mousemove.select", () => {
        if (!selectionRect!.visible()) return;
        const p = stage!.getRelativePointerPosition();
        if (!p) return;
        x2 = p.x; y2 = p.y;
        selectionRect!.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
        transformerLayer!.batchDraw();
    });

    stage.on("mouseup.select", () => {
        if (!selectionRect!.visible()) return;
        const box = selectionRect!.getClientRect();
        selectionRect!.visible(false);
        transformerLayer!.batchDraw();

        const selectable = nodeContentLayer!
            .find((n: Konva.Node) => n.getAttr("_selectable") === true)
            .filter((n: Konva.Node) => Konva.Util.haveIntersection(box, n.getClientRect()));

        selectedNodes = selectable;
        transformer!.nodes(selectedNodes);
        transformerLayer!.batchDraw();
    });

    // CONTEXT MENU
    stage.on("contextmenu.menu", (e) => {
        if (e.target instanceof Konva.Image) {
            setMenu("image", e.target as Konva.Image);
        } else if (e.target instanceof Konva.Rect) {
            setMenu("group", e.target as Konva.Rect);
        } else {
            setMenu("stage", null);
        }
        e.cancelBubble = true;
    });

    // ZOOM (centered on viewport center)
    stage.on("wheel.zoom", (e) => {
        e.evt.preventDefault();
        const oldScale = stage!.scaleX();
        const scaleBy = 1.05;
        const dir = e.evt.deltaY < 0 ? 1 : -1;
        const minScale = 0.2, maxScale = 5;

        const next = dir > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const newScale = Math.max(minScale, Math.min(maxScale, next));

        const center = { x: stage!.width() / 2, y: stage!.height() / 2 };
        const centerInStage = {
            x: (center.x - stage!.x()) / oldScale,
            y: (center.y - stage!.y()) / oldScale,
        };

        stage!.scale({ x: newScale, y: newScale });
        stage!.position({
            x: center.x - centerInStage.x * newScale,
            y: center.y - centerInStage.y * newScale,
        });

        stage!.batchDraw();
    });

    // --- API
    let destroyed = false;

    function ensureAlive<T>(val: T | null): T | null {
        return destroyed ? null : val;
    }

    function destroy() {
        if (destroyed) return;
        // Remove our namespaced handlers, then destroy
        stage?.off(".pan .select .menu .zoom");
        stage?.destroy();
        stage = null;
        nodeContentLayer = null;
        transformerLayer = null;
        transformer = null;
        selectionRect = null;
        destroyed = true;
    }

    function clear() {
        if (!nodeContentLayer || destroyed) return;
        nodeContentLayer.removeChildren();
        nodeContentLayer.batchDraw();
    }

    return {
        getStage: () => ensureAlive(stage),
        getContentLayer: () => ensureAlive(nodeContentLayer),
        getTransformer: () => ensureAlive(transformer),
        getSelectedNodes: () => selectedNodes,
        clear,
        destroy,
    };
}
