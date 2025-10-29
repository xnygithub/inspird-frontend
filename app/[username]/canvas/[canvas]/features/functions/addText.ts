
import { KonvaCanvasHandle } from '../canvas';
import createText from '../nodes/text';
import { saveToLocalStorage } from './saveLoadToJson';
import createGroup from '../nodes/group';
import { filterImagesNodes } from './utils';
import { useCanvasStore } from '../store';

export const addText = (apiRef: KonvaCanvasHandle) => {
    const layer = apiRef.getContentLayer();
    if (!layer) return;
    const textNode = createText(layer);
    if (textNode) layer.add(textNode);
}

export const groupSelected = (apiRef: KonvaCanvasHandle) => {
    const { selectedNodes } = useCanvasStore.getState();
    const layer = apiRef.getContentLayer();
    const transformer = apiRef.getTransformer();
    if (!layer || !transformer || !selectedNodes) return;

    const images = filterImagesNodes(selectedNodes);
    if (images.length === 0) return;
    const { innerNode } = createGroup(layer, transformer);
    innerNode.addNodes(images);
}
