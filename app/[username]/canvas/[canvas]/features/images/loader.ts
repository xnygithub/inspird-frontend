// Small cached image loader to avoid re-downloading the same URL
const cache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(url: string): Promise<HTMLImageElement> {
    if (cache.has(url)) return cache.get(url)!;

    const p = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });

    cache.set(url, p);
    return p;
}
