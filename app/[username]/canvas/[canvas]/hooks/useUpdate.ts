"use client";
import { useCallback, useState } from "react";
import type { ImgItem } from "../../../../../types/canvas";
import { CanvasData } from "../../../../../types/canvas";
import { Post } from "@/app/generated/prisma";


export function useUpdate(data: CanvasData) {
    const [images, setImages] = useState<ImgItem[]>(data.images);

    const patchImage = useCallback((id: string, patch: Partial<ImgItem>) => {
        setImages(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    }, []);


    const removeImage = useCallback((id: string) => {
        setImages(prev => prev.filter(it => it.id !== id));
    }, []);

    const addImage = useCallback((post: Post): ImgItem => {
        return {
            id: crypto.randomUUID(),
            src: post.mediaUrl,
            postId: post.id,
            width: post.mediaWidth,
            height: post.mediaHeight,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        };
    }, []);


    return { images, setImages, patchImage, removeImage, addImage };
}