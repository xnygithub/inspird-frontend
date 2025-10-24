import Konva from "konva";
import { loadImage } from "./loader";
import { zoomToFit } from '../../core/utils';


export type AddImageOptions = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    draggable?: boolean;
    id?: string;
};

export class ImageService {
    constructor(
        private readonly layer: Konva.Layer,
        private readonly transformer: Konva.Transformer,
    ) { }

    async addImage(url: string, opts: AddImageOptions = {}) {
        const imgEl = await loadImage(url);

        const width = opts.width ?? imgEl.width;
        const height = opts.height ?? imgEl.height;


        const stage = this.layer.getStage();
        const screenCenter = { x: stage.width() / 2, y: stage.height() / 2 };
        const inv = this.layer.getAbsoluteTransform().copy();
        inv.invert();
        const layerCenter = inv.point(screenCenter);

        const node = new Konva.Image({
            x: layerCenter.x,
            y: layerCenter.y,
            offsetX: imgEl.width / 2,
            offsetY: imgEl.height / 2,
            width: width,
            height: height,
            draggable: opts.draggable ?? true,
            image: imgEl,
            id: opts.id,
            name: "selectable",
            src: url,
        });

        this.layer.add(node);
        this.layer.batchDraw();

        node.on("click", (e) => {
            if (e.evt.button !== 0) return;
            e.target.moveToTop();
            this.transformer.nodes([node]);
            this.layer.batchDraw();
        });

        node.on("dragstart", (e) => {
            e.target.moveToTop();
        });

        node.on("dblclick", (e) => {
            if (e.evt.button !== 0) return;
            const stage = this.layer.getStage();
            zoomToFit(e, stage);
        });

        return node;

    }
}
