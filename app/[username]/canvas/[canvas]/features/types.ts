import Konva from "konva";

export type CanvasServiceAPI = {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getSelectedNodes: () => Konva.Node[] | null;
    getTransformer: () => Konva.Transformer | null;
};

export type GroupWithUpdate = Konva.Group & {
    updateBackground: () => void,
    addNodes: (nodes: Konva.Image[]) => void,
    removeNodes: (nodes: Konva.Image[]) => void,
    updateText: (text: string) => void
    getGroupName: () => string,
    deleteGroup: () => void,
};

export type OuterGroup = Konva.Group & {
    deleteGroup: () => void,
};

export type MenuType = "image" | "stage" | "group";
export type MenuNode = Konva.Image | Konva.Group | null