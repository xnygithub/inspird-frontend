"use client";

//types
import type Konva from "konva";
import type { CanvasData, ImgItem } from "@/types/canvas";
import type { CanvasDoc, GroupItem, TextItem } from "@/app/[username]/canvas/[canvas]/types";
import type { ProfilePostsType } from "@/types/posts";
import { updateCanvas } from "@/app/actions/canvas";

//hooks
import { useMemo, useRef, useContext, createContext, useEffect, useState, useLayoutEffect } from "react";

//utils
import { getMediaUrl } from '@/utils/urls'


type ctxMenuRef = Konva.Image | Konva.Group | null;
type ctxMenuKind = 'image' | 'group' | null;

const Ctx = createContext<{
    canvas: CanvasDoc
    parsed: CanvasData
    refs: {
        imgRef: React.RefObject<Konva.Image | null>,
        stageRef: React.RefObject<Konva.Stage | null>,
        layerRef: React.RefObject<Konva.Layer | null>,
        tfRef: React.RefObject<Konva.Transformer | null>,
    }
    images: ImgItem[]
    groups: GroupItem[]
    texts: TextItem[]
    ctxMenu: {
        open: boolean;
        ref: ctxMenuRef;
        kind: ctxMenuKind;
    }
    selectedGroup: GroupItem | null;
    setSelectedGroup: (group: GroupItem) => void;
    patchImage: (id: string, patch: Partial<ImgItem>) => void
    patchGroup: (id: string, patch: Partial<GroupItem>) => void
    setImages: (images: ImgItem[]) => void
    setGroups: (groups: GroupItem[]) => void
    setCtxMenu: (ctxMenu: {
        open: boolean;
        ref: ctxMenuRef;
        kind: ctxMenuKind;
    }) => void
    removeImage: (id: string) => void
    addPost: (post: ProfilePostsType[]) => void
    resetCamera: () => void
    handleSaveCanvas: () => Promise<void>
    GroupSelection: () => void
    removeItemFromGroup: (id: string) => void
    addText: () => void
    patchText: (id: string, patch: Partial<TextItem>) => void
    // UngroupSelection: () => void
} | undefined>(undefined);


export const CanvasProvider = ({
    canvas,
    children
}: {
    canvas: CanvasDoc,
    children: React.ReactNode
}) => {
    // Decode canvas data from database
    const parsed = useMemo(
        () => JSON.parse(canvas.data as unknown as string) as CanvasData,
        [canvas.data]
    );
    const [images, setImages] = useState<ImgItem[]>(parsed.images);
    const [groups, setGroups] = useState<GroupItem[]>(parsed.groups || []);
    const [texts, setTexts] = useState<TextItem[]>(parsed.texts || []);
    const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
    const [ctxMenu, setCtxMenu] = useState<{
        open: boolean;
        ref: ctxMenuRef;
        kind: ctxMenuKind;
    }>({ open: false, ref: null, kind: null });


    // Initialize refs for Konva components
    const refs = {
        imgRef: useRef<Konva.Image>(null),
        stageRef: useRef<Konva.Stage>(null),
        layerRef: useRef<Konva.Layer>(null),
        tfRef: useRef<Konva.Transformer>(null),
    };

    // Load initial stage state from canvas data saved in database
    useLayoutEffect(() => {
        if (!refs.stageRef.current) return;
        refs.stageRef.current.scale({ x: parsed.stage.zoom, y: parsed.stage.zoom });
        refs.stageRef.current.position({ x: parsed.stage.x, y: parsed.stage.y });
        refs.stageRef.current.batchDraw();
    }, []);


    const patchGroup = (id: string, patch: Partial<GroupItem>) => {
        console.log('patchGroup', id, patch);
        setGroups(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    };

    // Update image when dragged
    const patchImage = (id: string, patch: Partial<ImgItem>) => {
        setImages(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    };


    // Remove image from canvas
    const removeImage = (id: string) => {
        setImages(prev => prev.filter(it => it.id !== id));
    };

    const patchText = (id: string, patch: Partial<TextItem>) => {
        setTexts(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
    };

    // Add image to canvas
    const addImage = (post: ProfilePostsType): ImgItem => {
        return {
            id: crypto.randomUUID(),
            src: getMediaUrl(post.mediaUrl),
            postId: post.id,
            width: post.mediaWidth,
            height: post.mediaHeight,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        };
    };

    // Add posts to canvas
    const addPost = (post: ProfilePostsType[]) => {
        setImages([...images, ...post.map((p) => addImage(p))]);
    };

    // Reset camera to original position and scale
    const resetCamera = () => {
        if (!refs.stageRef.current) return;
        refs.stageRef.current.position({ x: 0, y: 0 });
        refs.stageRef.current.scale({ x: 1, y: 1 });
    }

    // Handle middle mouse drag
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            const stage = refs.stageRef.current;
            if (!stage || e.button !== 1) return;
            stage.stopDrag();
            stage.draggable(false);
        };
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [refs.stageRef]);

    // Handle save

    const handleSaveCanvas = async () => {
        const stage = refs.stageRef.current?.getStage();
        if (!stage) return;

        const canvasData: CanvasData = {
            schemaVersion: parsed.schemaVersion,
            stage: { zoom: stage.scaleX(), x: stage.x(), y: stage.y() },
            images: images,
            groups: groups,
            texts: texts,
        };
        const updatedCanvas = await updateCanvas(canvas.id, JSON.stringify(canvasData));
        if (!updatedCanvas) return;
    };

    const removeItemFromGroup = (childId: string) => {
        setGroups(prev => prev.map(group => group.children.includes(childId)
            ? { ...group, children: group.children.filter(child => child !== childId) }
            : group)
        );

        setImages(images.map(img => img.id === childId ? { ...img, parentId: undefined } : img));

    }

    const addText = () => {
        const newText: TextItem = {
            id: crypto.randomUUID(),
            text: "Text",
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
        };
        setTexts(prev => [...prev, newText]);
    }


    const GroupSelection = () => {
        const tr = refs.tfRef.current;
        const layer = refs.layerRef.current;
        if (!tr || !layer) return;

        const selected = tr.nodes()
            .filter((n) => n.getClassName() === "Image");
        if (selected.length < 2) return;

        const groupId = crypto.randomUUID();
        const newGroup: GroupItem = {
            id: groupId,
            name: "Group",
            title: "Group Title",
            children: selected.map((n) => n.id()),
        };

        // 3) update images -> local coords
        setImages(images.map((img: ImgItem) => {
            if (!newGroup.children.includes(img.id)) return img;
            return { ...img, parentId: groupId };
        }));


        setGroups([...groups, newGroup])

        tr.nodes([]);
        tr.getLayer()?.batchDraw();
        selected.forEach((n) => n.getLayer()?.batchDraw());
    }

    // const UngroupSelection = () => {
    //     const tr = refs.tfRef.current;
    //     const stage = refs.stageRef.current;
    //     if (!tr || !stage) return;

    //     const node = tr.nodes()[0];
    //     if (!node || node.getClassName() !== "Group") return;

    //     const groupId = node.id();
    //     // 1) get group model
    //     const g = groups.find((gg) => gg.id === groupId);
    //     if (!g) return;

    //     // 2) move children to root with ABS coordinates
    //     setImages(images.map((img: ImgItem) => {
    //         if (img.parentId !== groupId) return img;
    //         return {
    //             ...img,
    //             x: img.x + g.x,
    //             y: img.y + g.y,
    //             parentId: undefined,
    //         };
    //     }));

    //     // 3) remove group
    //     setGroups(groups.filter((gg: GroupItem) => gg.id !== groupId));

    //     // 4) update selection to those images (optional)
    //     requestAnimationFrame(() => {
    //         const imgs = g.children
    //             .map((id) => stage.findOne<Konva.Image>(`#${id}`))
    //             .filter(Boolean) as Konva.Image[];
    //         tr.nodes(imgs);
    //         tr.moveToTop();
    //         tr.getLayer()?.batchDraw();
    //     });
    // }



    return (
        <Ctx.Provider value={{
            canvas,
            parsed,
            refs,
            images,
            groups,
            texts,
            ctxMenu,
            selectedGroup,
            setSelectedGroup,
            patchImage,
            patchGroup,
            setImages,
            setCtxMenu,
            setGroups,
            removeImage,
            addPost,
            resetCamera,
            handleSaveCanvas,
            GroupSelection,
            removeItemFromGroup,
            addText,
            patchText
            // UngroupSelection
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useCanvas() {
    const context = useContext(Ctx);
    if (!context) throw new Error("useCanvas must be used within CanvasProvider");
    return context;
}
