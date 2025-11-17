import Konva from "konva";

/* Transformer Configuration: https://konvajs.org/api/Konva.Transformer.html */
export const TRANSFORMER_CONFIG: Partial<Konva.TransformerConfig> = {
    borderStroke: "#224144",
    borderStrokeWidth: 2,
    flipEnabled: false,
    rotateEnabled: false,
    centeredScaling: true,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
};

/* Selection Rect Configuration: https://konvajs.org/api/Konva.Rect.html */
export const SELECTION_RECT_CONFIG: Partial<Konva.RectConfig> = {
    fill: "#516f72",
    opacity: 0.5,
    stroke: "#224144",
    visible: false,
    listening: false,
}

/* Core Group Configuration */
export const GROUP_PADDING = 30;
export const GROUP_TITLE_PADDING = 30;

export const BACKGROUND_CONFIG: Partial<Konva.RectConfig> = {
    fill: "#222222",
    listening: true,
    name: "group-background",
}

export const INNER_GROUP_CONFIG: Partial<Konva.GroupConfig> = {
    id: crypto.randomUUID() as string,
    draggable: true,
    name: "group-content",
}

export const OUTER_GROUP_CONFIG: Partial<Konva.GroupConfig> = {
    draggable: true,
    name: "group-wrapper",
}

export const GROUP_TITLE_CONFIG: Partial<Konva.TextConfig> = {
    text: "Group",
    fontSize: 28,
    fill: "white",
    name: "group-title",
}

/*  Text Configuration: https://konvajs.org/api/Konva.Text.html */

export const KONVA_TEXT_CONFIG: Partial<Konva.TextConfig> = {
    text: "Text",
    fontSize: 40,
    fill: "white",
    draggable: true,
    name: "text-node",
}

export const TEXT_AREA_CONFIG: Partial<React.ComponentProps<"textarea">> = {
    style: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        resize: "none",
    },
}

export const TEXT_AREA_EDITING_CONFIG: Partial<React.ComponentProps<"textarea">> = {
    style: {
        position: "absolute",
        padding: "0",
        margin: "0",
        border: "none",
        outline: "none",
        background: "transparent",
        resize: "none",
        overflow: "hidden",
        zIndex: "1000",
    },
}

/* Arrow Configuration */
export const ARROW_HANDLE_CONFIG = {
    radius: 10,
    fill: "white",
    stroke: 'black',
    strokeWidth: 2,
    draggable: true,
    visible: true,
}

export const ARROW_GROUP_CONFIG: Partial<Konva.GroupConfig> = {
    x: 0, y: 0,
    draggable: true,
    name: "arrow-group-node"
}