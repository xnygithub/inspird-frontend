import { ImgItem } from "@/types/canvas";
import type Konva from "konva";

export const tfConfig: Konva.TransformerConfig = {
    flipEnabled: false,
    centeredScaling: true,
    rotateEnabled: false,
    enabledAnchors: [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
    ],
    boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 200) {
            return oldBox;
        }
        return newBox;
    }
};


export const imgConfig = (
    item: ImgItem,
): Partial<Konva.ImageConfig> => {
    return {
        x: item.x,
        y: item.y,
        id: item.id,
        draggable: true,
        offsetX: item.width / 2,
        offsetY: item.height / 2,
        width: item.width,
        height: item.height,
        scaleX: item.scaleX ?? 1,
        scaleY: item.scaleY ?? 1,
        rotation: item.rotation ?? 0,
    };
};


