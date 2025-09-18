"use client";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { Button } from "@/components/ui/button";
import { Upload, Toolbar } from "@/app/canvas/_components/toolbar";
import { Menu, Delete } from "@/app/canvas/_components/menu";
import URLImage from "@/app/canvas/_components/image";
import { ImgItem } from "@/app/canvas/_types/image";

const MAX_ZOOM = 1.5;
const MIN_ZOOM = 0.1;
const DOC_KEY = "canvas:doc:v1";


export default function CanvasPage() {
    const [hydrated, setHydrated] = useState(false);

    const [images, setImages] = useState<ImgItem[]>([]);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 75);

    const stageRef = useRef<Konva.Stage | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);

    useEffect(() => setHydrated(true), []);

    // Close context menu when clicking anywhere else
    useEffect(() => {
        const handleWindowClick = () => setShowMenu(false);
        window.addEventListener("click", handleWindowClick);
        return () => window.removeEventListener("click", handleWindowClick);
    }, []);

    const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        const target: Konva.Node = e.target;
        if (!target || target === target.getStage()) return;

        const stage = target.getStage();
        if (!stage) return;
        const containerRect = stage.container().getBoundingClientRect();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        setMenuPosition({
            x: containerRect.left + pointer.x + 4,
            y: containerRect.top + pointer.y + 4,
        });

        setSelectedId(target.id());
        setShowMenu(true);
        e.cancelBubble = true;
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setImages((prev) => prev.filter((it) => it.id !== selectedId));
        setShowMenu(false);
        setSelectedId(null);
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {

        e.evt.preventDefault();

        const stage = stageRef.current;
        if (!stage) return;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const scaleBy = 1.2;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        if (newScale > MAX_ZOOM || newScale < MIN_ZOOM) return;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    useEffect(() => {
        const raw = localStorage.getItem(DOC_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.images)) setImages(parsed.images);
            } catch {
                // ignore bad data
            }
        }
    }, []);

    const saveDoc = () => {
        localStorage.setItem(DOC_KEY, JSON.stringify({ images }));
        alert("Saved");
    };

    const loadDoc = () => {
        const raw = localStorage.getItem(DOC_KEY);
        if (!raw) return alert("Nothing saved yet");
        try {
            const parsed = JSON.parse(raw);
            setImages(parsed.images || []);
            alert("Loaded");
        } catch {
            alert("Failed to parse saved data");
        }
    };

    const patchImage = (id: string, patch: Partial<ImgItem>) => {
        setImages((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight - 75);
        };
        window.addEventListener("resize", handleResize);
    }, []);


    if (!hydrated) return null;



    return (
        <div className="bg-gray-500/20">
            <div>
                <Stage
                    draggable
                    ref={stageRef}
                    width={windowWidth}
                    height={windowHeight}
                    onWheel={handleWheel}
                    onContextMenu={handleContextMenu}
                >
                    <Layer ref={layerRef}>
                        {images.map((item) => (
                            <URLImage
                                item={item}
                                key={item.id}
                                onSelect={() => setSelectedId(item.id)}
                                onChange={(patch) => patchImage(item.id, patch)}
                            />
                        ))}
                    </Layer>
                </Stage>
                {showMenu && (
                    <Menu menuPosition={menuPosition}>
                        <Delete handleDelete={handleDelete} />
                    </Menu>
                )}
            </div>
            <Toolbar>
                <Upload setImages={setImages} />
                <Button onClick={saveDoc}>Save</Button>
                <Button onClick={loadDoc}>Load</Button>
            </Toolbar>
        </div >
    );
}
