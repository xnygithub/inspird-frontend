import Konva from "konva";
import { v4 as uuidv4 } from 'uuid';

const ARROW_HANDLE_CONFIG = {
    radius: 10,
    fill: "white",
    stroke: 'black',
    strokeWidth: 2,
    draggable: true,
    visible: true,
}

const ARROW_GROUP_CONFIG: Partial<Konva.GroupConfig> = {
    x: 0, y: 0,
    draggable: true,
    name: "arrow-group-node"
}

const ArrowConfig = (
    coords: { x1: number, y1: number, x2: number, y2: number },
    strokeWidth?: number,
): Konva.ArrowConfig => {
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

type Arrow = Konva.Arrow & {
    hideHandle: () => void;
}

type ArrowGroup = Konva.Group & {
    getNodes: () => {
        group: ArrowGroup;
        arrow: Arrow;
        startHandle: Konva.Circle;
        endHandle: Konva.Circle;
    }
}

const ArrowHandle = (coords: { x: number, y: number }) => {
    const { x, y } = coords;
    return new Konva.Circle({ ...ARROW_HANDLE_CONFIG, x, y });
}

const attachLogic = (
    layer: Konva.Layer,
    group: Konva.Group,
    arrow: Konva.Arrow,
    startHandle: Konva.Circle,
    endHandle: Konva.Circle
) => {

    let shouldHandleStayVisible = false;

    const syncArrowFromHandles = () => {
        arrow.points([
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

    group.add(arrow, startHandle, endHandle);
    startHandle.moveToTop();
    endHandle.moveToTop();

    const stage = layer.getStage();
    stage?.on('mousedown.arrow', (e) => {
        const names = ["arrow-node", "start-handle", "end-handle"];
        if (!names.includes(e.target.name())) {
            // If state is clicked hide handles
            shouldHandleStayVisible = false;
            hideHandle();
            return;
        } else {
            // When an arrow is clicked, hide the handles of all other arrows
            // (if any handles are visible)
            const target = e.target as Arrow | Konva.Circle;
            const arrows = layer.find('Arrow');
            const clickedArrowId = target.id();
            arrows.forEach(arrow => {
                if (arrow.id() !== clickedArrowId) {
                    (arrow as Arrow).hideHandle();
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

    const getNodes = () => {
        return { group, arrow, startHandle, endHandle }
    }

    startHandle.on('mousedown', () => shouldHandleStayVisible = true);
    endHandle.on('mousedown', () => shouldHandleStayVisible = true);
    group.on('mouseover', showHandle);
    group.on('mouseout', hideHandle);
    group.on('mousedown', () => group.moveToTop());
    group.on('click', () => {
        console.log("clicked on arrow group");
        shouldHandleStayVisible = true;
    });
    // @ts-expect-error - group has this func
    group.getNodes = getNodes;
    // @ts-expect-error - arrow has this func
    arrow.hideHandle = hideHandlers;

    layer.add(group);
}

const createArrow = (
    layer: Konva.Layer,
    coords: { x1: number, y1: number, x2: number, y2: number },
) => {
    const nodeId = uuidv4();
    const ARROW_CONFIG = ArrowConfig(coords);
    const arrow = new Konva.Arrow(ARROW_CONFIG).id(nodeId) as Arrow;

    const group = new Konva.Group(ARROW_GROUP_CONFIG)
    const startHandle = ArrowHandle({ x: coords.x1, y: coords.y1 }).name('start-handle').id(nodeId);
    const endHandle = ArrowHandle({ x: coords.x2, y: coords.y2 }).name('end-handle').id(nodeId);

    attachLogic(layer, group, arrow, startHandle, endHandle);
}

export default createArrow;
export { attachLogic };
export type { ArrowGroup };