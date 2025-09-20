"use client";
import type Konva from "konva";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import { useRef } from "react";
import { ImgItem } from '@/app/[username]/c/[canvas]/types';

type Props = {
    item: ImgItem;
    onChange: (patch: Partial<ImgItem>) => void;
    onSelect: (ref: Konva.Image) => void;
};

export default function URLImage({ item, onChange, onSelect }: Props) {
    const nodeRef = useRef<Konva.Image>(null);
    const [img] = useImage(item.src, "anonymous");

    return (
        <KonvaImage
            ref={nodeRef}
            id={item.id}
            image={img}
            draggable={true}
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