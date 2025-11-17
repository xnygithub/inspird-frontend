import Konva from "konva";

export type MenuType = "image" | "stage" | "group";

export type GroupContent = Konva.Group & {
    updateBackground: () => void,
    addNodes: (nodes: Konva.Image[]) => void,
    removeNodes: (nodes: Konva.Image[]) => void,
    deleteGroup: () => void,
};

export type GroupWrapper = Konva.Group & {
    setTitle: (text: string) => void,
    getTitle: () => string,
    getColor: () => string,
    setColor: (color: string) => void,
    deleteGroup: () => void,
};

export type Arrow = Konva.Arrow & {
    hideHandle: () => void;
}

export type ImageNode = Konva.Image & {
    destroyImage: () => void,
    removeFromGroup: () => void,
    isGrouped: () => boolean,
    rotateImage: (dir: 'left' | 'right') => void,
    flipImage: (dir: 'horizontal' | 'vertical') => void,
    getAddableBoards: () => GroupContent[],
};