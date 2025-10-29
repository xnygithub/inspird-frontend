import type Konva from 'konva';
import { create } from 'zustand';
import { GroupWrapper, MenuType } from './types';

type CanvasState = {
    /* Selected Nodes Properties */
    selectedNodes: Konva.Node[];
    setSelectedNodes: (nodes: Konva.Node[]) => void;
    appendSelectedNodes: (nodes: Konva.Node[]) => void;

    /* Whether the canvas has been initialized */
    initialized: boolean;
    setInitialized: (initialized: boolean) => void;

    /* Editor Properties */
    group: GroupWrapper | null;
    setGroup: (group: GroupWrapper | null) => void;
    editorOpen: boolean;
    setEditorOpen: (open: boolean) => void;

    /* Menu Properties */
    menu: { type: MenuType, object: Konva.Node | null };
    setMenu: (type: MenuType, object: Konva.Node | null) => void;
};

export const useCanvasStore = create<CanvasState>((set) => ({

    /* Whether the canvas has been initialized */
    initialized: false,
    setInitialized: (initialized: boolean) => set({ initialized }),

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
    appendSelectedNodes: (nodes) => set((state) => ({ selectedNodes: [...state.selectedNodes, ...nodes] })),
}));


