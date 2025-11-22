import Konva from "konva";
import { SELECTION_RECT_CONFIG, TRANSFORMER_CONFIG } from "../config";
import { hydrateImages } from "../hydration/hydrateImage";
import { hydrateGroups } from "../hydration/hydrateGroup";
import { hydrateStage } from "../hydration/hydrageStage";
import { hydrateTexts } from "../hydration/hydrateText";
import { hydrateArrows } from "../hydration/hydrateArrow";
import { useStore } from "../store";
import { filterIntersecting } from "../functions/utils";

function createStage(
    container: HTMLDivElement,
    size: { height: number, width: number },
    data?: any, // eslint-disable-line
) {

    let stage: Konva.Stage | null = null;

    // data = JSON.parse(data.data);
    const isEmpty = Object.keys(data.data).length === 0;

    if (!isEmpty) {
        stage = Konva.Node.create(data.data, container) as Konva.Stage;
        hydrateImages(stage);
        hydrateGroups(stage);
        hydrateTexts(stage);
        hydrateArrows(stage);
        hydrateStage(stage);
        return stage;
    }

    let mainContentLayer: Konva.Layer | null = null;
    let transformerLayer: Konva.Layer | null = null;
    let selectionBox: Konva.Rect | null = null;
    let kTransformer: Konva.Transformer | null = null;

    stage = new Konva.Stage({
        name: "stage",
        container: container,
        width: size.width,
        height: size.height
    });
    mainContentLayer = new Konva.Layer({ name: "main-layer" });
    transformerLayer = new Konva.Layer({ name: "transformer-layer" });
    selectionBox = new Konva.Rect({ name: "selection-rect", ...SELECTION_RECT_CONFIG });
    kTransformer = new Konva.Transformer({ name: "transformer", ...TRANSFORMER_CONFIG });

    stage.add(mainContentLayer);
    stage.add(transformerLayer);
    transformerLayer.add(kTransformer);
    transformerLayer.add(selectionBox);
    hydrateStage(stage);
    return stage;
}

function attachStageLogic(
    stage: Konva.Stage,
    mainLayer: Konva.Layer,
    transformer: Konva.Transformer,
    tfLayer: Konva.Layer,
    selectionRect: Konva.Rect,
) {
    const { setMenu, setSelectedNodes } = useStore.getState();

    stage.off(".pan .select .menu .zoom .scale .menu .node");

    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    let isPanning = false;
    let lastPointerPosition: { x: number, y: number } | null = null;

    const CLICK_TOLERANCE = 3; // px

    let downPos: { x: number; y: number } | null = null;
    let movedBeyondTolerance = false;

    const dist = (
        a: { x: number; y: number },
        b: { x: number; y: number }) =>
        Math.hypot(a.x - b.x, a.y - b.y
        );

    stage.on('mousedown.pan', (e) => {
        if (e.evt.button !== 1) return;
        e.cancelBubble = true;
        if (!(e.target instanceof Konva.Stage)) return;

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
    stage.on("click.node", (e) => {
        if (movedBeyondTolerance) {
            e.cancelBubble = true;
            return;
        }
        if (e.target instanceof Konva.Group) {
            setSelectedNodes([]);
            transformer.nodes([]);
            tfLayer.batchDraw();
        }
    });

    stage.on("mousedown.select", (e) => {
        if (e.target !== stage) return;
        if (e.target instanceof Konva.Group) return;
        if (e.evt.button !== 0) return;

        const p = stage.getRelativePointerPosition(); if (!p) return;
        downPos = { x: p.x, y: p.y };
        movedBeyondTolerance = false;
        x1 = x2 = p.x; y1 = y2 = p.y;
        selectionRect?.setAttrs({ x: x1, y: y1, width: 0, height: 0, visible: true });
        tfLayer.batchDraw();
    });

    stage.on("mousemove.select", () => {
        if (!selectionRect?.visible()) return;
        const p = stage.getRelativePointerPosition(); if (!p) return;

        if (downPos && !movedBeyondTolerance && dist(downPos, p) > CLICK_TOLERANCE) {
            movedBeyondTolerance = true;
        }

        x2 = p.x; y2 = p.y;
        selectionRect?.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
        tfLayer.batchDraw();
    });

    stage.on("mouseup.select", () => {
        if (!selectionRect?.visible()) {
            downPos = null;
            return;
        }
        const box = selectionRect?.getClientRect();
        selectionRect?.visible(false);
        tfLayer.batchDraw();

        const nodes = mainLayer.find(".image-node, .group-wrapper, .arrow-group-node, .text-node")
        console.info("nodes", nodes);
        const selected = filterIntersecting(nodes, box);
        console.info("selected nodes", selected.length);

        setSelectedNodes(selected);
        transformer.nodes(selected);
        tfLayer.batchDraw();
        downPos = null;
    });

    stage.on("contextmenu.menu", (e) => {
        if (e.target.name() === "stage") {
            setMenu("stage", null);
            return;
        }
    });

    stage.on('wheel.scale', (e) => {
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
export default createStage;
export { attachStageLogic };