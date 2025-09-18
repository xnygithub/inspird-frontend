"use client";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Button } from "@/components/ui/button";
import { Upload, Toolbar } from "@/app/canvas/_components/toolbar";
import { Menu, Delete } from "@/app/canvas/_components/menu";
import URLImage from "@/app/canvas/_components/image";
import { ImgItem } from "@/app/canvas/_types/image";

const MAX_ZOOM = 1.2;
const MIN_ZOOM = 0.1;


export default function CanvasPage() {
    const [hydrated, setHydrated] = useState(false);

    const [images, setImages] = useState<ImgItem[]>([]);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    useEffect(() => setHydrated(true), []);

    // Close context menu when clicking anywhere else
    useEffect(() => {
        const handleWindowClick = () => setShowMenu(false);
        window.addEventListener("click", handleWindowClick);
        return () => window.removeEventListener("click", handleWindowClick);
    }, []);

    const handleContextMenu = (e: any) => {
        e.evt.preventDefault();
        const target = e.target;
        if (!target || target === target.getStage()) return;

        const stage = target.getStage();
        const containerRect = stage.container().getBoundingClientRect();
        const pointer = stage.getPointerPosition();

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

    const handleWheel = (e) => {

        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

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


    if (!hydrated) return null;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight - 75;

    const handleSerialize = () => {
        // In a real app, prefer saving app state, not stage JSON
        const json = JSON.stringify({ shapes: [images] });
        console.log('Serialized state:', json);
        alert('State serialized! Check the console for the JSON string.');
    };

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
                            <URLImage item={item} key={item.id} />
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
                <Button onClick={handleSerialize}>Save</Button>
            </Toolbar>
        </div >
    );
}
