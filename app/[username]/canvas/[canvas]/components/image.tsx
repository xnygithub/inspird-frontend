"use client";

import type Konva from "konva";
import { useRef } from "react";
import useImage from "use-image";
import { useCanvas } from "../provider";
import type { ImgItem } from '@/types/canvas';
import { Image as KonvaImage } from "react-konva";
import { KonvaMouseEvent } from "../types";
import { zoomToFit } from "./function";


export default function URLImage({
    item,
}: {
    item: ImgItem;
}) {
    const cfg = config(item);
    const [img] = useImage(item.src, "anonymous");
    const nodeRef = useRef<Konva.Image>(null);
    const { refs: { tfRef, stageRef }, setCtxMenu, patchImage } = useCanvas();

    const handleClick = (e: KonvaMouseEvent) => {
        if (!e.evt || !nodeRef.current || !tfRef.current) return;
        if (nodeRef.current.getType() !== "Shape") return;

        if (e.evt.shiftKey) {
            tfRef.current.nodes([...tfRef.current.nodes(), nodeRef.current]);
        } else {
            if (tfRef.current.nodes().length >= 2 &&
                tfRef.current.nodes().includes(nodeRef.current)) return;
            tfRef.current.nodes([nodeRef.current]);
        }
        nodeRef.current.moveToTop();
        tfRef.current.moveToTop();
    }

    const handleDragEnd = () => {
        if (!nodeRef.current) return;
        patchImage(item.id, {
            x: nodeRef.current.x(),
            y: nodeRef.current.y(),
        });
    }

    const handleTransformEnd = () => {
        if (!nodeRef.current) return;
        patchImage(item.id, {
            x: nodeRef.current.x(),
            y: nodeRef.current.y(),
            scaleX: nodeRef.current.scaleX(),
            scaleY: nodeRef.current.scaleY(),
            rotation: nodeRef.current.rotation(),
        })
    }

    const handleContextMenu = () => {
        if (!nodeRef.current) return;

        setCtxMenu({
            open: true,
            ref: nodeRef.current,
            kind: 'image'
        });
    }


    nodeRef.current?.setAttr("id", item.id);
    nodeRef.current?.setAttr("src", item.src);
    nodeRef.current?.setAttr("width", item.width);
    nodeRef.current?.setAttr("height", item.height);
    nodeRef.current?.setAttr("postId", item.postId);

    return (
        <KonvaImage
            {...cfg}
            image={img}
            ref={nodeRef}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            onDblClick={(e) => {
                if (!stageRef.current || !e.target) return;
                zoomToFit(e, stageRef.current);
            }}
            onTransformEnd={handleTransformEnd}
            onContextMenu={handleContextMenu}
        />
    );
}


const config = (
    item: ImgItem,
): Partial<Konva.ImageConfig> => {
    return {
        x: item.x,
        y: item.y,
        id: item.id,
        draggable: true,
        offsetX: item.width / 2,
        offsetY: item.height / 2,
        scaleX: item.scaleX ?? 1,
        scaleY: item.scaleY ?? 1,
    };
};
