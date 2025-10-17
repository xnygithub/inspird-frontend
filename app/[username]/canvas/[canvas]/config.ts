export const trConfig = {
    anchorCornerRadius: 50,
    flipEnabled: false,
    rotateEnabled: false,
    centeredScaling: true,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    // @ts-expect-error - Not sure about type here
    boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 200) {
            return oldBox;
        }
        return newBox;
    }
};