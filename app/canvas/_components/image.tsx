import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { ImgItem } from '@/app/canvas/_types/image';
import { useRef } from "react";

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

    return (
        <KonvaImage
            ref={nodeRef}
            id={item.id}
            image={img}
            draggable
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