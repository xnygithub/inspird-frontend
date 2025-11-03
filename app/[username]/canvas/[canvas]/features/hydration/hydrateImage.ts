// utils/hydrateImages.ts
import Konva from "konva";
import { loadImage } from "../functions/imageLoader"; // your existing loader
import { attachImageLogic } from "../nodes/image";

export async function hydrateImages(stage: Konva.Stage): Promise<void> {

    const images = stage.find<Konva.Image>("Image");
    const transformer = stage.findOne<Konva.Transformer>("Transformer");
    const layer = stage.findOne<Konva.Layer>(".main-layer");
    if (!transformer || !layer) throw new Error("Transformer or layer not found");

    await Promise.all(
        images.map(async (node: Konva.Image) => {
            const src = node.getAttr('src');
            if (!src) return;

            try {
                const imgEl = await loadImage(src);
                node.image(imgEl);
                attachImageLogic(node, transformer, layer);
            } catch (e) {
                console.warn('Failed to load image src:', src, e);
            }
        })
    ).then(() => {
        console.info("images hydrated");
    });
}
