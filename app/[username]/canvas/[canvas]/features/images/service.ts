import Konva from "konva";
import { loadImage } from "./loader";

export type AddImageOptions = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    draggable?: boolean;
    id?: string;
};

export class ImageService {
    // NOTE: depends only on a Layer, not the full canvas service
    constructor(
        private readonly layer: Konva.Layer,
        private readonly transformer: Konva.Transformer
    ) { }

    async addImage(url: string, opts: AddImageOptions = {}) {
        const imgEl = await loadImage(url);
        const node = new Konva.Image({
            x: opts.x ?? 0,
            y: opts.y ?? 0,
            width: opts.width ?? imgEl.width,
            height: opts.height ?? imgEl.height,
            draggable: opts.draggable ?? true,
            image: imgEl,
            id: opts.id,
            name: "selectable",
        });

        this.layer.add(node);
        this.layer.batchDraw();

        node.on("click", () => {
            this.transformer.nodes([node]);
            this.layer.batchDraw();
        });
        return node;
    }
}
