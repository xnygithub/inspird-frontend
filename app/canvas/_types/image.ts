export type ImgItem = {
    id: string;
    src: string;  // data URL (portable)
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    width?: number;
    height?: number;
};