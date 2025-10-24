import Konva from "konva";

export type CanvasServiceAPI = {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getSelectedNodes: () => Konva.Node[] | null;
};
