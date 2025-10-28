import Konva from "konva";
import { KONVA_TEXT_CONFIG } from "../config";
import { getCenter } from "../functions/utils";
import { attachLogic } from "./textLogic";


export function KonvaText(layer: Konva.Layer) {
    const stage = layer.getStage();
    if (!stage || !layer) return;

    const layerCenter = getCenter(layer);
    const textNode = new Konva.Text({
        ...KONVA_TEXT_CONFIG,
        x: layerCenter.x,
        y: layerCenter.y,
    });

    attachLogic(textNode, layer, stage);
    return textNode;
}
