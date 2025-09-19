"use client";
import type Konva from "konva";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { ImgItem } from '@/app/[username]/c/[canvas]/types';

type Props = {
    item: ImgItem;
    onChange: (patch: Partial<ImgItem>) => void;
    onSelect: (ref: Konva.Image) => void;
};

export default function URLImage({ item, onChange, onSelect }: Props) {
    const nodeRef = useRef<Konva.Image>(null);
    const [img] = useImage(item.src, "anonymous");
    const [isDraggable, setIsDraggable] = useState(true);

    useEffect(() => {
        // Only draggable when Shift is NOT held
        const down = (e: KeyboardEvent) => e.key === "Shift" && setIsDraggable(false);
        const up = (e: KeyboardEvent) => e.key === "Shift" && setIsDraggable(true);
        document.addEventListener("keydown", down);
        document.addEventListener("keyup", up);
        return () => {
            document.removeEventListener("keydown", down);
            document.removeEventListener("keyup", up);
        };
    }, []);

    return (
        <KonvaImage
            ref={nodeRef}
            id={item.id}
            image={img}
            draggable={isDraggable}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            scaleX={item.scaleX ?? 1}
            scaleY={item.scaleY ?? 1}
            rotation={item.rotation ?? 0}
            onMouseDown={(e) => { onSelect(e.target as Konva.Image) }}
            onDragEnd={(e) => { onChange({ x: e.target.x(), y: e.target.y() }) }}
            onTransformEnd={(e) => {
                onChange({
                    x: e.target.x(),
                    y: e.target.y(),
                    scaleX: e.target.scaleX(),
                    scaleY: e.target.scaleY(),
                    rotation: e.target.rotation(),
                });
            }}
        />
    );
}