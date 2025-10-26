import Konva from "konva";
import { TEXT_AREA_EDITING_CONFIG } from "./config";


export function attachLogic(
    textNode: Konva.Text,
    layer: Konva.Layer,
    stage: Konva.Stage
) {
    textNode.off("dblclick.text dbltap.text");

    const placeTextarea = (textarea: HTMLTextAreaElement) => {

        const abs = textNode.getAbsolutePosition();
        const scale = textNode.getAbsoluteScale().x;

        const containerRect = stage.container().getBoundingClientRect();
        const top = containerRect.top + window.scrollY + abs.y;
        const left = containerRect.left + window.scrollX + abs.x;

        textarea.style.top = `${top}px`;
        textarea.style.left = `${left}px`;


        textarea.style.width = `auto`;
        textarea.style.overflow = "hidden";
        textarea.style.height = `${textNode.height() * scale}px`;


        textarea.style.fontSize = `${textNode.fontSize() * scale}px`;
        textarea.style.lineHeight = `${textNode.lineHeight()}`;
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill().toString();

    };

    const startEditing = () => {
        const textarea = document.createElement("textarea");
        textarea.value = textNode.text();
        Object.assign(textarea.style, TEXT_AREA_EDITING_CONFIG.style);

        document.body.appendChild(textarea);
        textNode.hide();

        // Initial placement
        placeTextarea(textarea);
        textarea.focus();
        textarea.select();

        let justOpened = true;

        const commit = () => {
            textNode.text(textarea.value);
            cleanup();
        };

        const cancel = () => cleanup();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                commit();
            } else if (e.key === "Escape") {
                e.preventDefault();
                cancel();
            } else {
                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";
            }
        };

        const onOutside = (e: MouseEvent) => {
            if (justOpened) return;
            const target = e.target
            if (target && (target === textarea || textarea.contains(target as Node))) return;

            setTimeout(() => {
                justOpened = false;

                // pointerdown feels snappier and catches drag starts
                window.addEventListener("pointerdown", onOutside, true);
            }, 0);
        };

        const onTransformMove = () => placeTextarea(textarea);

        window.addEventListener("keydown", onKey);
        window.addEventListener("click", onOutside);
        window.addEventListener("scroll", () => placeTextarea(textarea), { passive: true });

        const stage = layer.getStage();
        // Reposition if canvas pans/zooms/drags
        stage?.on("dragmove zoom wheel transform", onTransformMove);
        layer.on("dragmove", onTransformMove);

        function cleanup() {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("click", onOutside);
            textarea.remove();
            textNode.show();
            stage?.off("dragmove zoom wheel transform", onTransformMove);
            textNode.off("dragmove", onTransformMove);
            textNode.getLayer()?.batchDraw();
        }
    };

    textNode.on("dblclick.text", (e) => {
        e.cancelBubble = true;
        startEditing();
    });

    textNode.on("dbltap.text",
        (e) => {
            e.cancelBubble = true;
            startEditing();
        });


}