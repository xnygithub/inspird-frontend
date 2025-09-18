import "./../canvas.css";
import React from 'react'
import { Button } from '@/components/ui/button';
import { ImgItem } from '@/app/canvas/_types/image';

export function Toolbar({ children }: { children: React.ReactNode }) {
    return (
        <div id="canvas-toolbar" >{children}</div>
    )
}

interface UploadProps {
    setImages: React.Dispatch<React.SetStateAction<ImgItem[]>>;
}

export function Upload({ setImages }: UploadProps) {
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const startX = 60;
        const startY = 60;

        Array.from(files).forEach((file, idx) => {
            const url = URL.createObjectURL(file);
            const id = crypto.randomUUID();
            // simple stagger so you can see multiple images
            setImages((prev: ImgItem[]) => [
                ...prev,
                { id, src: url, x: startX + idx * 30, y: startY + idx * 30 },
            ]);
        });

        e.currentTarget.value = ""; // reset input
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleUpload}
                className="bottom-4 left-1/2 fixed bg-gray-400 p-4 translate-x-[-50%] cursor-pointer"
            />
            <Button onClick={() => {
                const input = document.querySelector("input[type='file']") as HTMLInputElement;
                input?.click();
            }}>Upload</Button>
        </div>
    )
}
