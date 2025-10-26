import type Konva from "konva";

const saveToLocalStorage = (stage: Konva.Stage) => {
    const data = stage.toJSON();
    localStorage.setItem("canvas-data", JSON.stringify(data));
}

const loadFromLocalStorage = () => {
    const data = localStorage.getItem("canvas-data");
    if (!data) return null;
    return JSON.parse(data);
}


export { saveToLocalStorage, loadFromLocalStorage };