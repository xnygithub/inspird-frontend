import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ImageMeta {
  url: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export function getImageMeta(file: File): Promise<ImageMeta> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      resolve({
        url: `${crypto.randomUUID()}.${file.name.split('.').pop()}`,
        size: file.size,
        type: file.type,
        width: image.width,
        height: image.height,
        aspectRatio: image.width / image.height
      });
      URL.revokeObjectURL(image.src);
    };
  });
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // result is an ArrayBuffer → convert to base64 string
      const result = reader.result as string
      // FileReader with readAsDataURL returns a data: URI
      // so we strip the `data:image/png;base64,` prefix
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}