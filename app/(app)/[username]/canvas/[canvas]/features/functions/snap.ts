import Konva from "konva";

const GUIDELINE_OFFSET = 5;

function getObjectSnappingEdges(node: Konva.Shape) {
    const box = node.getClientRect();
    const absPos = node.absolutePosition();

    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(absPos.x - box.x),
                snap: 'start',
            },
            {
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(absPos.x - box.x - box.width / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(absPos.x - box.x - box.width),
                snap: 'end',
            },
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(absPos.y - box.y),
                snap: 'start',
            },
            {
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(absPos.y - box.y - box.height / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(absPos.y - box.y - box.height),
                snap: 'end',
            },
        ],
    };
}

function getGuides(
    lineGuideStops: {
        vertical: number[],
        horizontal: number[]
    },
    itemBounds: {
        vertical: {
            guide: number,
            offset: number,
            snap: string
        }[],
        horizontal: {
            guide: number,
            offset: number,
            snap: string
        }[]
    }) {
    const resultV: { lineGuide: number, diff: number, snap: string, offset: number }[] = [];
    const resultH: { lineGuide: number, diff: number, snap: string, offset: number }[] = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
            const diff = Math.abs(lineGuide - itemBound.guide);
            // if the distance between guild line and object snap point is close we can consider this for snapping
            if (diff < GUIDELINE_OFFSET) {
                console.info("lineGuide", lineGuide);
                console.info("itemBound", itemBound);
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
            const diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < GUIDELINE_OFFSET) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    const guides = [];

    // find closest snap
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap,
        });
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap,
        });
    }
    return guides;
}

function drawGuides(layer: Konva.Layer, guides: { lineGuide: number, offset: number, orientation: string, snap: string }[]) {
    guides.forEach((lg) => {
        if (lg.orientation === 'H') {
            const line = new Konva.Line({
                points: [-6000, 0, 6000, 0],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guide-line',
                dash: [4, 6],
            });
            layer.add(line);
            line.absolutePosition({
                x: 0,
                y: lg.lineGuide,
            });
        } else if (lg.orientation === 'V') {
            const line = new Konva.Line({
                points: [0, -6000, 0, 6000],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guide-line',
                dash: [4, 6],
            });
            layer.add(line);
            line.absolutePosition({
                x: lg.lineGuide,
                y: 0,
            });
        }
    });
}

export { getObjectSnappingEdges, getGuides, drawGuides };