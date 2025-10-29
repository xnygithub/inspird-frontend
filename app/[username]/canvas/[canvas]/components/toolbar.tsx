import React from 'react'
import { KonvaCanvasHandle } from '../features/canvas';
import ImportPosts from './import';
import { Button } from '@/components/ui/button';
import { Text, ArrowUp, Group, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addText } from '../features/functions/addText';
import { groupSelected } from '../features/functions/addText';
import { saveJson } from '../features/functions/saveLoadToJson';
import createArrow from '../features/nodes/arrow';
import { useCanvasStore } from '../features/store';
import { Konva } from 'konva/lib/_CoreInternals';
import Test from './importcopy';

interface Props {
    apiRef: React.RefObject<KonvaCanvasHandle | null>;
}

const containsGroup = (nodes: Konva.Node[]) => {
    return nodes.some(node => node instanceof Konva.Group);
}
const isInGroup = (nodes: Konva.Node[]) => {
    return nodes.some(node => node.getParent() instanceof Konva.Group);
}

const ToolbarContainer = ({ apiRef }: Props) => {
    const id = "14cc186e-934d-4397-98b1-d364719ff528"
    const api = apiRef.current!;
    const selectedNodes = useCanvasStore((s) => s.selectedNodes);
    const transformer = api.getTransformer();

    const hasGroups = containsGroup(selectedNodes);
    const inGroup = isInGroup(selectedNodes);
    const disabled = selectedNodes?.length === 0 || hasGroups || inGroup;

    const unselectAll = () => {
        if (!transformer) return;
        transformer.nodes([]);
        useCanvasStore.setState({ selectedNodes: [] });
    }

    const addArrow = () => {
        const layer = api.getContentLayer();
        if (!layer) return;
        createArrow(layer, { x1: 100, y1: 100, x2: 200, y2: 200 });
    }

    return (
        <div className={cn(
            "right-1/2 bottom-4 absolute translate-x-1/2",
            "bg-black p-4 rounded-full ")}>
            <ImportPosts canvasRef={apiRef} />
            <Test />
            <Button variant="icon" onClick={() => addText(api)}> <Text /> Add Text</Button>
            <Button variant="icon" onClick={() => addArrow()}> <ArrowUp /> Add Arrow</Button>
            <Button variant="icon" onClick={() => groupSelected(api)} disabled={disabled}> <Group /> Group selection</Button>
            <Button variant="icon" onClick={() => unselectAll()} disabled={selectedNodes?.length === 0}> <X /> Unselect all</Button>
            {/* <Button variant="destructiveIcon" disabled={selectedNodes.length === 0}> <Save /> Delete selected</Button> */}
            <Button variant="icon" onClick={() => saveJson(api, id)}> <Save /> Save Canvas</Button>
        </div>
    )
}

export default ToolbarContainer