import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ImageSize {
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export function getImageSize(file: File): Promise<ImageSize> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      resolve({
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
