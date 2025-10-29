import Konva from "konva";

export type MenuType = "image" | "stage" | "group";

export interface CanvasServiceAPI {
    getStage: () => Konva.Stage | null;
    getContentLayer: () => Konva.Layer | null;
    getTransformer: () => Konva.Transformer | null;
    clear: () => void;
    destroy: () => void;
}

export type GroupContent = Konva.Group & {
    updateBackground: () => void,
    addNodes: (nodes: Konva.Image[]) => void,
    removeNodes: (nodes: Konva.Image[]) => void,
    deleteGroup: () => void,
};

export type GroupWrapper = Konva.Group & {
    updateText: (text: string) => void,
    getGroupName: () => string,
    getColor: () => string,
    setColor: (color: string) => void,
    deleteGroup: () => void,
};

export type Arrow = Konva.Arrow & {
    hideHandle: () => void;
}

