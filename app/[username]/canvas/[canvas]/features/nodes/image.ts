import Konva from "konva";
import { loadImage } from "../functions/imageLoader";
import { attachLogic } from "./imageLogic";
import { v4 as uuidv4 } from 'uuid';
import { getCenter } from "../functions/utils";

export async function addImage(
    layer: Konva.Layer,
    transformer: Konva.Transformer,
    url: string
) {
    const imgEl = await loadImage(url);
    const layerCenter = getCenter(layer);

    // Scale image down
    const targetWidth = 200;
    const scaleFactor = targetWidth / imgEl.width;

    const newWidth = imgEl.width * scaleFactor;
    const newHeight = imgEl.height * scaleFactor;

    const node = new Konva.Image({
        x: layerCenter.x,
        y: layerCenter.y,
        offsetX: newWidth / 2,
        offsetY: newHeight / 2,
        width: newWidth,
        height: newHeight,
        draggable: true,
        image: imgEl,
        id: uuidv4(),
        _selectable: true,
        name: "image-node",
        src: url,
    });

    layer.add(node);
    attachLogic(node, transformer);
    layer.batchDraw();
    return node;
}

