import type Konva from "konva";

const saveStage = async (stage: Konva.Stage | null, canvasDocId: string) => {
    if (!stage) throw Error("Failed to save, stage not present")
    const data = stage.toJSON();
    const res = await fetch('/api/konva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, canvasDocId }),
    })
    console.log("res", await res.json())
}


export { saveStage };