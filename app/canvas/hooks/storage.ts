import { useCallback, useEffect, useState } from "react";
import type { ImgItem } from "@/app/canvas/types";

const DOC_KEY = "canvas:doc:v1";

export function useLocalDoc() {
    const [images, setImages] = useState<ImgItem[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(DOC_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.images)) setImages(parsed.images);
            }
        } catch {
            // ignore bad data
        }
    }, []);


    const save = useCallback(() => {
        localStorage.setItem(DOC_KEY, JSON.stringify({ images }));
        alert("Saved");
    }, [images]);


    const load = useCallback(() => {
        const raw = localStorage.getItem(DOC_KEY);
        if (!raw) return alert("Nothing saved yet");
        try {
            const parsed = JSON.parse(raw);
            setImages(parsed.images || []);
            alert("Loaded");
        } catch {
            alert("Failed to parse saved data");
        }
    }, []);


    const patchImage = useCallback((id: string, patch: Partial<ImgItem>) => {
        setImages(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    }, []);


    const removeImage = useCallback((id: string) => {
        setImages(prev => prev.filter(it => it.id !== id));

    }, []);


    return { images, setImages, save, load, patchImage, removeImage };
}