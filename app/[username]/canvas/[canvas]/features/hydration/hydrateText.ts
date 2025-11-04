import Konva from "konva";
import { attachTextLogic } from "../nodes/text";


export async function hydrateTexts(stage: Konva.Stage): Promise<void> {

    const texts = stage.find<Konva.Text>(".text-node");
    const layer = stage.findOne<Konva.Layer>(".main-layer");
    if (!layer) throw new Error("Layer not found");
    for (const text of texts) {
        attachTextLogic(text, layer, stage);
    }
}
