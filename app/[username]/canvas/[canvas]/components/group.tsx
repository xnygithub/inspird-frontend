"use client";
import Konva from "konva";
import { useCallback, useRef } from "react";
import { Group as KonvaGroup, Rect } from "react-konva";
import { GroupItem, KonvaEvent } from "../types";
import { useState, useEffect, useLayoutEffect } from "react";
import { useCanvas } from "../provider";
import { Box } from "konva/lib/shapes/Transformer";
import { KonvaGroupText } from "./text";
import { zoomToFit } from "./function";


export default function GroupNode({
    group, children
}: {
    group: GroupItem; children: React.ReactNode
}) {
    const { refs: { tfRef, stageRef }, setCtxMenu, patchGroup, setSelectedGroup } = useCanvas();
    const boundRef = useRef<Konva.Group>(null);
    const groupRef = useRef<Konva.Group>(null);
    const rectRef = useRef<Konva.Rect>(null);

    const [borderBox, setBorderBox] = useState<Box | null>(null);

    // Helper: measure content group in the OUTER group's local coordinates
    const measure = useCallback(() => {
        const bound = boundRef.current;
        const group = groupRef.current;
        const transformer = tfRef.current;
        if (!bound || !group || !transformer) return;

        if (transformer.nodes().length > 0) {
            transformer.nodes([]);
        };

        // Get client rect of content relative to OUTER group,
        // so we can directly set Rect x/y/width/height as children of OUTER.
        const border = group.getClientRect({ relativeTo: bound });
        setBorderBox({
            x: border.x,
            y: border.y,
            width: border.width,
            height: border.height,
            rotation: 0 // Ignored for now
        });
    }, [boundRef, groupRef, tfRef]);

    // Initial measure after mount and layout
    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            measure();
        });
    }, [measure]);

    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        // Critical: Dont add any transform (exluding transformend)
        // event to children, causes transfomer to misbehave
        const attach = (node: Konva.Node) => {
            node.on("destroy dragmove transformend dragend", measure);
        };

        const detach = (node: Konva.Node) => {
            node.off("destroy dragmove transformend dragend", measure);
        };

        group.getChildren().forEach((child: Konva.Node) => {
            if (child.className !== 'Text') {
                attach(child);
            }
        });

        // If children are added/removed dynamically, handle that too
        const onAdd = (e: KonvaEvent) => attach(e.target as Konva.Node);
        const onRemove = (e: KonvaEvent) => detach(e.target as Konva.Node);
        group.on("add", onAdd);
        group.on("remove", onRemove);

        return () => {
            group.getChildren().forEach(detach);
            group.off("add", onAdd);
            group.off("remove", onRemove);
        };
    }, [measure]);

    const padding = {
        top: 125,
        right: 50,
        bottom: 50,
        left: 50,
    };
    const padded = borderBox && {
        x: borderBox.x - padding.left,
        y: borderBox.y - padding.top,
        width: borderBox.width + padding.left + padding.right,
        height: borderBox.height + padding.top + padding.bottom,
    };

    const onGroupClick = () => {
        const bound = boundRef.current;
        if (!tfRef.current) return;
        if (!bound) return;

        tfRef.current.nodes([bound]);
        tfRef.current.getLayer()?.batchDraw();
        bound.moveToTop();
        setSelectedGroup(group);
    };

    const onGroupContextMenu = () => {
        setCtxMenu({ open: true, ref: boundRef.current, kind: 'group' });
    }

    const onGroupTransformEnd = () => {
        patchGroup(group.id, {
            x: boundRef.current?.x(),
            y: boundRef.current?.y(),
            scaleX: boundRef.current?.scaleX(),
            scaleY: boundRef.current?.scaleY(),
        });
    }

    const onGroupDragEnd = () => {
        patchGroup(group.id, {
            x: boundRef.current?.x(),
            y: boundRef.current?.y(),
        });
    }

    return (
        <KonvaGroup
            x={group.x}
            y={group.y}
            id={group.id}
            ref={boundRef}
            draggable={true}
            scaleX={group.scaleX}
            scaleY={group.scaleY}
            onDragEnd={onGroupDragEnd}
            onTransformEnd={onGroupTransformEnd}
            onDragStart={(e) => {
                e.target.moveToTop();
            }}
            onDblClick={(e) => {
                if (!stageRef.current || !e.target) return;
                zoomToFit(e, stageRef.current);
            }}>
            <Rect
                ref={rectRef}
                x={padded?.x}
                y={padded?.y}
                {...groupConfig}
                width={padded?.width}
                height={padded?.height}
                onClick={onGroupClick}
                onContextMenu={onGroupContextMenu}
            />
            <KonvaGroupText
                group={group}
                x={padded?.x ? padded.x + 50 : 0}
                y={padded?.y ? padded.y + 40 : 0}
            />
            <KonvaGroup ref={groupRef} draggable={false}>
                {children}
            </KonvaGroup>
        </KonvaGroup>
    );
}


const groupConfig: Partial<Konva.RectConfig> = {
    name: "image-group",
    listening: true,
    fill: "#222831",
    stroke: "#393E46",
    strokeWidth: 2,
};