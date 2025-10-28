import { KonvaCanvasHandle } from '../KonvaCanvas';
import { KonvaText } from '../nodes/text';
import { saveToLocalStorage } from './saveLoadToJson';
import { createGroup } from '../nodes/group';
import { filterNodes } from './utils';
import { useCanvasStore } from '../store';

export const addText = (apiRef: KonvaCanvasHandle) => {
    const layer = apiRef.getContentLayer();
    if (!layer) return;
    const textNode = KonvaText(layer);
    if (textNode) layer.add(textNode);
}

export const groupSelected = (apiRef: KonvaCanvasHandle) => {
    const { selectedNodes } = useCanvasStore.getState();
    const layer = apiRef.getContentLayer();
    const transformer = apiRef.getTransformer();
    if (!layer || !transformer || !selectedNodes) return;

    const images = filterNodes(selectedNodes, ["image-node"]);
    if (images.length === 0) return;
    const { innerNode } = createGroup(layer, transformer);
    innerNode.addNodes(images);
}

export const saveCanvas = (apiRef: KonvaCanvasHandle) => {
    const canvas = apiRef.getStage();
    if (!canvas) return;
    saveToLocalStorage(canvas);
}

