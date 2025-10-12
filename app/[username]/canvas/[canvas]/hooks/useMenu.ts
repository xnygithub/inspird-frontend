"use client";
import { useCallback, useEffect, useState } from "react";
import type Konva from "konva";

export function useContextMenu() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Close on global click
    useEffect(() => {
        const onClick = () => setVisible(false);
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, []);

    const onContextMenu = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        const target = e.target as Konva.Node | null;
        if (!target || target === target.getStage()) return;

        const stage = target.getStage();
        if (!stage) return;
        const containerRect = stage.container().getBoundingClientRect();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        setPosition({ x: containerRect.left + pointer.x + 4, y: containerRect.top + pointer.y + 4 });
        setSelectedId(target.id());
        setVisible(true);
        e.cancelBubble = true;
    }, []);

    return { position, visible, selectedId, setVisible, setSelectedId, onContextMenu };
}