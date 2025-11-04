import type Konva from 'konva';
import { create } from 'zustand';
import { GroupWrapper, MenuType } from './types';

type CanvasState = {

    /* Konva store */
    stage: Konva.Stage | null;
    setStage: (stage: Konva.Stage) => void;
    transformer: Konva.Transformer | null;
    setTransformer: (transformer: Konva.Transformer) => void;
    contentLayer: Konva.Layer | null;
    setContentLayer: (contentLayer: Konva.Layer) => void;

    /* Nodes Store */
    nodes: Konva.Node[];
    addNodes: (nodes: Konva.Node[]) => void;
    patchNode: (node: Konva.Node) => void;
    deleteNodes: (node: Konva.Node) => void;

    /* Groups Store */
    groups: GroupWrapper[];
    addGroups: (groups: GroupWrapper[]) => void;
    deleteGroups: (group: GroupWrapper) => void;


    /* Selected Nodes Store */
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

    /* Clear Store */
    clearStore: () => void;
};

export const useStore = create<CanvasState>((set) => ({

    /* Konva store */
    stage: null,
    setStage: (stage) => set({ stage }),
    transformer: null,
    setTransformer: (transformer) => set({ transformer }),
    contentLayer: null,
    setContentLayer: (contentLayer) => set({ contentLayer }),

    /* Nodes Store */
    nodes: [],
    addNodes: (nodes) => set((state) => ({ nodes: [...state.nodes, ...nodes] })),
    patchNode: (node) => set((state) => ({
        nodes: state.nodes.map(n => n.id() === node.id() ? node : n)
    })),
    deleteNodes: (node) => set((state) => ({ nodes: state.nodes.filter(n => n !== node) })),

    /* Groups Store */
    groups: [],
    addGroups: (groups: GroupWrapper[]) => set((state) => ({ groups: [...state.groups, ...groups] })),
    deleteGroups: (group: GroupWrapper) => set((state) => ({ groups: state.groups.filter(g => g !== group) })),

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

    /* Clear Store */
    clearStore: () => set({
        stage: null,
        transformer: null,
        contentLayer: null,
        nodes: [],
        groups: [],
        selectedNodes: [],
        initialized: false,
        group: null,
        editorOpen: false,
        menu: { type: "stage", object: null },
    }),
}));


