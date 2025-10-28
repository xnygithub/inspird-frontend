import Konva from "konva";
import { SELECTION_RECT_CONFIG, TRANSFORMER_CONFIG } from "../config";
import { hydrateImages } from "../hydration/hydrateImage";
import { hydrateGroups } from "../hydration/hydrateGroup";
import { hydrateStage } from "../hydration/hydrageStage";
import { hydrateTexts } from "../hydration/hydrateText";
import { hydrateArrows } from "../hydration/hydrateArrow";

export interface CanvasServiceAPI {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getTransformer: () => Konva.Transformer | null;
    clear: () => void;
    destroy: () => void;
}

export function createStage({
    container,
    height,
    width,
    data = null,
}: {
    container: HTMLDivElement;
    height: number,
    width: number,
    data?: any, // eslint-disable-line
}
) {

    let stage: Konva.Stage | null = null;

    if (data) {
        stage = Konva.Node.create(data, container) as Konva.Stage;
        hydrateImages(stage);
        hydrateGroups(stage);
        hydrateTexts(stage);
        hydrateArrows(stage);
        return hydrateStage({ stage });
    }

    let mainContentLayer: Konva.Layer | null = null;
    let transformerLayer: Konva.Layer | null = null;
    let selectionBox: Konva.Rect | null = null;
    let kTransformer: Konva.Transformer | null = null;

    stage = new Konva.Stage({ name: "stage", container, width, height });
    mainContentLayer = new Konva.Layer({ name: "main-layer" });
    transformerLayer = new Konva.Layer({ name: "transformer-layer" });
    selectionBox = new Konva.Rect({ name: "selection-rect", ...SELECTION_RECT_CONFIG });
    kTransformer = new Konva.Transformer({ name: "transformer", ...TRANSFORMER_CONFIG });

    stage.add(mainContentLayer);
    stage.add(transformerLayer);
    transformerLayer.add(kTransformer);
    transformerLayer.add(selectionBox);
    return hydrateStage({ stage });

}
