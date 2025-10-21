import { Database } from "@/database.types";
import type Konva from "konva";

type Id = string;
type Canvas = Database["public"]["Tables"]["canvas_doc"]["Row"];
type Owner = {
    username: string;
    id: string;
};

export type CanvasDoc = Canvas & {
    owner: Owner;
}

export type GroupItem = {
    id: Id;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    name?: string;
    title: string;
    children: Id[];
}

export type TextItem = {
    id: Id;
    text: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
}

export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>;
export type KonvaKeyboardEvent = Konva.KonvaEventObject<KeyboardEvent>;
export type KonvaEvent = Konva.KonvaEventObject<Event>;