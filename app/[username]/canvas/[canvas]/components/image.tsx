"use client";

//types
import type Konva from "konva";
import type { ImgItem } from '@/types/canvas';

//hooks
import useImage from "use-image";
import { useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import { useCanvas } from "../provider";

export default function URLImage({
    item,
}: {
    item: ImgItem;
}) {
    const { patchImage, refs: { imgRef, trRef } } = useCanvas();
    const nodeRef = useRef<Konva.Image>(null);
    const [img] = useImage(item.src, "anonymous");

    const onRefClick = (ref: Konva.Image) => {
        if (!trRef.current) return;
        if (ref.getType() !== "Shape") return;
        imgRef.current = ref;
        imgRef.current?.moveToTop();

        // If tfRes has more than 2 nodes, and image ref is already in the nodes,
        // We assume the user has made a selection and is about to drag/move the selection
        if (trRef.current.nodes().length >= 2 && trRef.current.nodes().includes(ref)) return;
        trRef.current.nodes([ref]);
        trRef.current.moveToTop();
        trRef.current.getLayer()?.batchDraw();
    };

    return (
        <KonvaImage
            x={item.x}
            y={item.y}
            image={img}
            id={item.id}
            ref={nodeRef}
            draggable={true}
            postId={item.postId}
            width={item.width}
            height={item.height}
            scaleX={item.scaleX ?? 1}
            scaleY={item.scaleY ?? 1}
            rotation={item.rotation ?? 0}
            onMouseDown={(e) => onRefClick(e.target as Konva.Image)}
            onDragEnd={(e) => {
                patchImage(item.id, { x: e.target.x(), y: e.target.y() } as Partial<ImgItem>);
            }}
            onTransformEnd={(e) => patchImage(item.id, {
                x: e.target.x(),
                y: e.target.y(),
                scaleX: e.target.scaleX(),
                scaleY: e.target.scaleY(),
                rotation: e.target.rotation(),
            } as Partial<ImgItem>)}
        />
    );
}