import type Konva from "konva";
import { useRef, useState, useEffect } from 'react'
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useCanvas } from "../provider";
import { GroupItem, KonvaMouseEvent, TextItem } from "../types";

const KonvaText = ({
    data,
}: {
    data: TextItem
}) => {
    // Refs
    const { refs: { tfRef }, patchText } = useCanvas();
    const textRef = useRef<Konva.Text>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        const tNode = textRef.current;
        const tfNode = tfRef.current;
        if (!tNode || !tfNode) return;
        if (tfNode.nodes().includes(tNode)) {
            tfNode.nodes([]);
        }
        setIsEditing(!isEditing);

    }

    const keydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape')
            setIsEditing(false);
    }

    const textChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        patchText(data.id, { text: e.target.value });
    }

    const onDragEnd = (e: KonvaMouseEvent) => {
        patchText(data.id, { x: e.target.x(), y: e.target.y() });
    }

    const onTransformEnd = () => {
        const tNode = textRef.current;
        if (!tNode) return;
        patchText(data.id, {
            x: tNode.x(),
            y: tNode.y(),
            scaleX: tNode.scaleX(),
            scaleY: tNode.scaleY()
        });
    }

    const onClick = (e: KonvaMouseEvent) => {
        const tNode = textRef.current;
        const tfNode = tfRef.current;
        if (!tNode || !tfNode) return;
        if (e.evt.shiftKey) {
            tfNode.nodes([...tfNode.nodes(), tNode]);
        } else {
            if (tfNode.nodes().length >= 2 && tfNode.nodes().includes(tNode)) return;
            tfNode.nodes([tNode]);
        }
        tfNode.moveToTop();
    }

    useEffect(() => {
        const handler = (e: PointerEvent) => {
            const ref = textAreaRef.current;
            if (!ref) return;
            if (isEditing && !ref.contains(e.target as Node)) {
                setIsEditing(false);
            }
        };


        document.addEventListener('pointerdown', handler, true);
        return () => document.removeEventListener('pointerdown', handler, true);
    }, [isEditing]);


    if (isEditing) {
        return (
            <Html groupProps={{ x: data.x, y: data.y, scaleX: data.scaleX, scaleY: data.scaleY }}>
                <textarea
                    ref={textAreaRef}
                    autoFocus
                    value={data.text}
                    onChange={textChange}
                    onKeyDown={keydown}
                    style={textAreaConfig}
                />
            </Html>
        );
    }

    return (
        <Text
            {...config}
            x={data.x}
            y={data.y}
            ref={textRef}
            text={data.text}
            scaleX={data.scaleX}
            scaleY={data.scaleY}
            onClick={onClick}
            onDragEnd={onDragEnd}
            onDblClick={toggleEdit}
            onTransformEnd={onTransformEnd}
            onContextMenu={() => console.log("context menu")}
        />
    );
}

const KonvaGroupText = ({ group, x, y }: {
    group: GroupItem;
    x?: number;
    y?: number;
}) => {
    const { patchGroup } = useCanvas();
    const textRef = useRef<Konva.Text>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [textValue, setTextValue] = useState(group.title ? group.title : "Group Title");

    const toggleEdit = () => {
        const tNode = textRef.current;
        if (!tNode) return;
        setIsEditing(!isEditing);
    }

    const keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log("enter");
            patchGroup(group.id, { title: (e.target as HTMLInputElement).value });
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            setTextValue(group.title ? group.title : "Group Title");
            setIsEditing(false);
        }

    }

    const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setTextValue(e.target.value);
    }

    useEffect(() => {
        const handler = (e: PointerEvent) => {
            const ref = inputRef.current;
            if (!ref) return;
            if (isEditing && !ref.contains(e.target as Node)) {
                setIsEditing(false);
            }
        };
        document.addEventListener('pointerdown', handler, true);
        return () => document.removeEventListener('pointerdown', handler, true);
    }, [isEditing]);

    const config: React.CSSProperties = {
        backgroundColor: "transparent",
        border: "1px solid #393E46",
        outline: "none",
        boxShadow: "none",
        padding: 0,
        margin: 0,
        fontFamily: "sans-serif",
        fontSize: 45,
        width: "auto",
        boxSizing: "content-box", // keep height = line box only
        lineHeight: `${45}px`, // line box = glyph box
        height: `${45}px`,     // prevents vertical shift
        display: "block",             // avoid baseline alignment quirks
    };


    if (isEditing) {
        return (
            <Html groupProps={{ x: x, y: y }}>
                <input
                    autoFocus
                    ref={inputRef}
                    value={textValue}
                    onKeyDown={keydown}
                    onChange={textChange}
                    style={config}
                />
            </Html>
        );
    }

    return (
        <Text
            x={x}
            y={y}
            ref={textRef}
            fontSize={45}
            text={textValue}
            fill="white"
            fontFamily="sans-serif"
            onClick={(e) => e.cancelBubble = true}
            onDblClick={toggleEdit}
        />
    );
}


export default KonvaText;
export { KonvaGroupText };



const config: Konva.TextConfig = {
    fill: "white",
    fontFamily: "sans-serif",
    fontSize: 24,
    draggable: true,
}

const textAreaConfig: React.CSSProperties = {
    fill: "white",
    backgroundColor: "none",
    border: "1px solid #393E46",
    outline: "none",
    boxShadow: "none",
    padding: 0,
    margin: 0,
    fontFamily: "sans-serif",
    fontSize: 24,
    resize: "none",
    overflow: "hidden",
    height: "fit-content",
    width: "fit-content",
    maxWidth: "fit-content",
}

