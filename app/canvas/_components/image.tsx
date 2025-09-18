import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { ImgItem } from '@/app/canvas/_types/image';

export default function URLImage({ item }: { item: ImgItem }) {
    const [img] = useImage(item.src);
    return (
        <KonvaImage
            id={item.id}
            image={img}
            x={item.x}
            y={item.y}
            // keep origin top-left for simplicity
            draggable
        />
    );
}
