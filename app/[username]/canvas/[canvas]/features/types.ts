import Konva from "konva";

export type CanvasServiceAPI = {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getTransformer: () => Konva.Transformer | null;
};

export type GroupWithUpdate = Konva.Group & {
    updateBackground: () => void,
    addNodes: (nodes: Konva.Image[]) => void,
    removeNodes: (nodes: Konva.Image[]) => void,
    deleteGroup: () => void,
};

export type OuterGroup = Konva.Group & {
    updateText: (text: string) => void,
    getGroupName: () => string,
    getColor: () => string,
    setColor: (color: string) => void,
    deleteGroup: () => void,
};

export type MenuType = "image" | "stage" | "group";
export type MenuNode = Konva.Image | Konva.Group | null