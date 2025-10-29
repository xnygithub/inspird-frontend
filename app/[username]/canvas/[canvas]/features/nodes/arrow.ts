import Konva from "konva";
import { v4 as uuidv4 } from 'uuid';
import { ARROW_HANDLE_CONFIG, ARROW_GROUP_CONFIG } from '../config';
import { Arrow } from '../types';

function getArrowConfig(
    coords: { x1: number, y1: number, x2: number, y2: number },
    strokeWidth?: number,
) {
    const { x1, y1, x2, y2 } = coords;
    strokeWidth = strokeWidth ?? 10
    const pointerWidth = strokeWidth * 1.5
    const pointerLength = strokeWidth * 2
    return {
        points: [x1, y1, x2, y2],
        strokeWidth,
        pointerWidth,
        pointerLength,
        stroke: 'white',
        fill: 'white',
        name: 'arrow-node',
    }
}

function createArrow(
    layer: Konva.Layer,
    coords: { x1: number, y1: number, x2: number, y2: number },
) {
    const nodeId = uuidv4();
    const ARROW_NODE_CONFIG = getArrowConfig(coords);
    const arrow = new Konva.Arrow(ARROW_NODE_CONFIG).id(nodeId) as Arrow;

    const group = new Konva.Group(ARROW_GROUP_CONFIG)
    const startHandle = new Konva.Circle({
        ...ARROW_HANDLE_CONFIG,
        x: coords.x1, y: coords.y1
    }).name('start-handle').id(nodeId);

    const endHandle = new Konva.Circle({
        ...ARROW_HANDLE_CONFIG,
        x: coords.x2, y: coords.y2
    }).name('end-handle').id(nodeId);

    attachArrowLogic(layer, group, arrow, startHandle, endHandle);
}

function attachArrowLogic(
    layer: Konva.Layer,
    group: Konva.Group,
    arrow: Konva.Arrow,
    startHandle: Konva.Circle,
    endHandle: Konva.Circle
) {
    const aNode = arrow as Arrow;

    let shouldHandleStayVisible = false;

    const syncArrowFromHandles = () => {
        aNode.points([
            startHandle.x(),
            startHandle.y(),
            endHandle.x(),
            endHandle.y()]);
    }

    const showHandle = () => {
        if (shouldHandleStayVisible) return;
        startHandle.show();
        endHandle.show();
    }

    const hideHandle = () => {
        if (shouldHandleStayVisible) return;
        startHandle.hide();
        endHandle.hide();
    }

    const hideHandlers = () => {
        shouldHandleStayVisible = false;
        hideHandle();
    }

    group.add(aNode, startHandle, endHandle);
    startHandle.moveToTop();
    endHandle.moveToTop();

    const stage = layer.getStage();
    stage?.on('mousedown.arrow', (e) => {
        const names = ["arrow-node", "start-handle", "end-handle"];
        if (!names.includes(e.target.name())) {
            shouldHandleStayVisible = false;
            hideHandle();
            return;
        } else {
            // When an arrow is clicked, hide the handles of all other arrows
            // (if any handles are visible)
            const target = e.target as Arrow | Konva.Circle;
            const arrows = layer.find<Arrow>('Arrow');
            const clickedArrowId = target.id();
            arrows.forEach(aNode => {
                if (aNode.id() !== clickedArrowId) {
                    aNode.hideHandle();
                }
            });
        }
    });

    startHandle.on('dragmove', () => {
        shouldHandleStayVisible = true;
        syncArrowFromHandles();
    });

    endHandle.on('dragmove', () => {
        shouldHandleStayVisible = true;
        syncArrowFromHandles();
    });


    startHandle.on('mousedown', () => shouldHandleStayVisible = true);
    endHandle.on('mousedown', () => shouldHandleStayVisible = true);
    group.on('mouseover', showHandle);
    group.on('mouseout', hideHandle);
    group.on('mousedown', () => group.moveToTop());
    group.on('click', () => shouldHandleStayVisible = true);
    aNode.hideHandle = hideHandlers;
    layer.add(group);
}

export default createArrow;
export { attachArrowLogic };