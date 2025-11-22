import React, { useRef } from 'react'
import Konva from 'konva';
import { Button } from '@/components/ui/button';
import { Text, ArrowUp, Group, X, Save, ZoomIn, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import createText from '../features/nodes/text';
import { saveStage } from '../features/functions/saveStage';
import createArrow from '../features/nodes/arrow';
import { useStore } from '../features/store';
import { AddImagesDialog } from './addImagesDialog';
import { filterImagesNodes } from '../features/functions/utils';
import createGroup from '../features/nodes/group';
import { zoomToAllNodes } from '../features/functions/zoom';
import type { ProfilePostsType as Posts } from "@/types/posts";
import addImage from '../features/nodes/image';
import { getMediaUrl } from '@/utils/urls';


const containsGroup = (nodes: Konva.Node[]) => {
    return nodes.some(node => node instanceof Konva.Group);
}
const isInGroup = (nodes: Konva.Node[]) => {
    return nodes.some(node => node.getParent() instanceof Konva.Group);
}

function groupNodes(
    layer: Konva.Layer,
    nodes: Konva.Node[],
    transformer: Konva.Transformer
) {
    if (!nodes || nodes.length === 0) return;
    const images = filterImagesNodes(nodes);

    if (images.length === 0) return;
    const { innerNode } = createGroup(layer, transformer);
    innerNode.addNodes(images);
}


const ToolbarContainer = () => {
    const initialized = useStore((s) => s.initialized);
    const id = "14cc186e-934d-4397-98b1-d364719ff528"
    const nodes = useStore((s) => s.selectedNodes);
    const transformer = useStore((s) => s.transformer);
    const stage = useStore((s) => s.stage);
    const layer = useStore((s) => s.contentLayer);
    const isZooming = useRef(false);

    const zoom = () => {
        if (isZooming.current) return;
        isZooming.current = true;
        zoomToAllNodes(layer as Konva.Layer);
        setTimeout(() => {
            isZooming.current = false;
        }, 1000);
    }

    if (!initialized || !layer || !transformer) return;

    const hasGroups = containsGroup(nodes);
    const inGroup = isInGroup(nodes);
    const groupable = nodes?.length === 0 || hasGroups || inGroup;

    const unselectAll = () => {
        if (!transformer) return;
        transformer.nodes([]);
        useStore.setState({ selectedNodes: [] });
    }

    const addArrow = () => {
        const arrow = createArrow(layer);
        if (arrow) layer.add(arrow);
    }

    const newText = () => {
        const textNode = createText(layer);
        if (textNode) layer.add(textNode);
    }

    const addPost = async (post: Posts) => {
        const url = getMediaUrl(post.mediaUrl);
        const image = await addImage(layer, transformer, url);
        if (image) {
            layer.add(image);
            layer.batchDraw();
        }
    }

    const deleteSelected = () => {
        nodes.forEach(node => node.destroy());
        transformer.nodes([]);
        useStore.setState({ selectedNodes: [] });
        layer.batchDraw();
    }

    return (
        <div className={cn(
            "right-1/2 bottom-4 absolute whitespace-nowrap translate-x-1/2",
            "bg-black p-4 rounded-full ")}>
            <AddImagesDialog addPost={addPost} />
            <Button
                variant="icon"
                onClick={() => newText()}>
                <Text /> Add Text
            </Button>
            <Button
                variant="icon"
                onClick={() => addArrow()}>
                <ArrowUp /> Add Arrow
            </Button>
            <Button
                variant="icon"
                onClick={() => groupNodes(layer, nodes, transformer)}
                disabled={groupable}>
                <Group />Group selection
            </Button>
            <Button
                variant="icon"
                onClick={() => unselectAll()}
                disabled={nodes.length <= 1}>
                <X /> Unselect all
            </Button>
            <Button
                variant="icon"
                disabled={nodes.length === 0}
                onClick={() => deleteSelected()}>
                <Trash /> Delete selected
            </Button>
            <Button
                variant="icon"
                onClick={() => zoom()}>
                <ZoomIn /> Fit Canvas
            </Button>
            <Button
                variant="icon"
                onClick={() => saveStage(stage, id)}>
                <Save /> Save Canvas
            </Button>
        </div >
    )
}

export default ToolbarContainer