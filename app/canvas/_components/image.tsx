import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { ImgItem } from '@/app/canvas/_types/image';
import { useEffect, useRef, useState } from "react";

type Props = {
    item: ImgItem;
    onChange: (patch: Partial<ImgItem>) => void;
    onSelect?: () => void;
};

export default function URLImage({ item, onChange, onSelect }: Props) {
    const [img] = useImage(item.src, "anonymous");
    const nodeRef = useRef<any>(null);

    const START_WIDTH = 300;
    const aspectRatio = item.width ? item.height ? item.width / item.height : 1 : 1;
    const START_HEIGHT = START_WIDTH / aspectRatio;

    const [isDraggable, setIsDraggable] = useState(false);

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
            width={START_WIDTH}
            height={START_HEIGHT}
            scaleX={item.scaleX ?? 1}
            scaleY={item.scaleY ?? 1}
            rotation={item.rotation ?? 0}
            onMouseDown={onSelect}
            onDragEnd={(e) => {
                onChange({ x: e.target.x(), y: e.target.y() });
            }}
            onTransformEnd={() => {
                const n = nodeRef.current;
                onChange({
                    x: n.x(),
                    y: n.y(),
                    scaleX: n.scaleX(),
                    scaleY: n.scaleY(),
                    rotation: n.rotation(),
                });
            }}
        />
    );
}