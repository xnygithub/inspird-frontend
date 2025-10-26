import Konva from "konva";
import { SELECTION_RECT_CONFIG, TRANSFORMER_CONFIG } from "./config";
import { hydrateImages } from "./functions/hydrateImage";
import { hydrateGroups } from "./functions/hydrateGroup";
import { hydrateStage } from "./functions/hydrageStage";
import { hydrateTexts } from "./functions/hydrateText";
import type { MenuType, MenuNode } from "./types";

interface Props {
    container: HTMLDivElement;
    height: number;
    width: number;
    data?: any; // eslint-disable-line
    setMenu: (type: MenuType, node: MenuNode) => void;
}

export function initCanvas({
    container,
    height,
    width,
    data = null,
    setMenu
}:
    Props
) {

    let stage: Konva.Stage | null = null;

    const selectedNodes: Konva.Node[] = [];

    if (data) {
        stage = Konva.Node.create(data, container) as Konva.Stage;
        hydrateImages(stage);
        hydrateGroups(stage);
        hydrateTexts(stage);
        return hydrateStage({ stage, selectedNodes, setMenu });
    }
    let mainLayer: Konva.Layer | null = null;
    let transformerLayer: Konva.Layer | null = null;
    let selectionRect: Konva.Rect | null = null;
    let transformer: Konva.Transformer | null = null;

    stage = new Konva.Stage({ name: "stage", container, width, height });
    mainLayer = new Konva.Layer({ name: "main-layer" });
    transformerLayer = new Konva.Layer({ name: "transformer-layer" });
    selectionRect = new Konva.Rect({ name: "selection-rect", ...SELECTION_RECT_CONFIG });
    transformer = new Konva.Transformer({ name: "transformer", ...TRANSFORMER_CONFIG });

    stage.add(mainLayer);
    stage.add(transformerLayer);
    transformerLayer.add(transformer);
    transformerLayer.add(selectionRect);
    return hydrateStage({ stage, selectedNodes, setMenu });

}
