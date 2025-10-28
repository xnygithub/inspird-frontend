import type Konva from 'konva';
import { create } from 'zustand';
import { OuterGroup } from './types';


type MenuType = "image" | "stage" | "group";

type CanvasState = {
    /* Selected Nodes Properties */
    selectedNodes: Konva.Node[];
    setSelectedNodes: (nodes: Konva.Node[]) => void;

    /* Editor Properties */
    group: OuterGroup | null;
    setGroup: (group: OuterGroup | null) => void;
    editorOpen: boolean;
    setEditorOpen: (open: boolean) => void;

    /* Menu Properties */
    menu: { type: MenuType, object: Konva.Node | null };
    setMenu: (type: MenuType, object: Konva.Node | null) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({

    /* Editor Properties */
    group: null,
    setGroup: (group) => set({ group }),
    editorOpen: false,
    setEditorOpen: (open) => set({ editorOpen: open }),

    /* Menu Properties */
    menu: {
        type: "stage",
        object: null,
    },
    setMenu: (type, object) => set({ menu: { type, object } }),

    /* Selected Nodes Properties */
    selectedNodes: [],
    setSelectedNodes: (nodes) => set({ selectedNodes: nodes }),
}));


