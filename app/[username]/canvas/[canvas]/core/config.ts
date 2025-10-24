import Konva from "konva";

// Transformer
export const TRANSFORMER_CONFIG: Partial<Konva.TransformerConfig> = {
    flipEnabled: false,
    rotateEnabled: false,
    centeredScaling: true,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
};

// Group
export const GROUP_PADDING = 10;
export const GROUP_CONFIG: Konva.RectConfig = {
    fill: "rgba(0,0,0,0.5)",
    listening: true,
    name: "group-bg",
}