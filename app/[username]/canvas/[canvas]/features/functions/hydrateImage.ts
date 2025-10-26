// utils/hydrateImages.ts
import Konva from "konva";
import { loadImage } from "../loader"; // your existing loader
import { attachImageInteractions } from "../image.interactions";

export async function hydrateImages(root: Konva.Stage): Promise<void> {
    const images = root.find<Konva.Image>("Image");
    const transformer = root.find<Konva.Transformer>("Transformer")[0] as Konva.Transformer;

    await Promise.all(
        images.map(async (node: Konva.Image) => {
            const src = node.getAttr('src');
            if (!src) return;

            try {
                const imgEl = await loadImage(src);
                node.image(imgEl);
                attachImageInteractions(node, transformer);
            } catch (e) {
                console.warn('Failed to load image src:', src, e);
            }
            node.getLayer()?.batchDraw();
        })
    );
}
