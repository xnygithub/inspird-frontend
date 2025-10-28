import Konva from "konva";
import { attachLogic } from "../nodes/textLogic";


export async function hydrateTexts(stage: Konva.Stage): Promise<void> {

    let texts: Konva.Text[] = [];
    texts = stage.find<Konva.Text>("Text");
    texts = texts.filter((t: Konva.Text) => t.name() === 'text-node');
    const layer = stage.getChildren(n => n.name() === 'main-layer')[0] as Konva.Layer;
    for (const text of texts) {
        attachLogic(text, layer, stage);
    }
}
