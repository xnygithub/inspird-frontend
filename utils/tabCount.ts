function getTabCount(
    count: number, text: string
) {
    return count + " " + (count === 1 ? text : text + "s")
}

export function getTabCounts(
    counts: {
        itemCount: number,
        folderCount: number,
        canvasCount: number
    }
) {
    return {
        pins: getTabCount(counts.itemCount, "Pin"),
        folders: getTabCount(counts.folderCount, "Folder"),
        canvas: getTabCount(counts.canvasCount, "Canvas")
    }
}