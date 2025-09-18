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
            const reader = new FileReader();
            reader.onload = () => {
                const src = String(reader.result);

                // create an Image object to get dimensions
                const img = new window.Image();
                img.onload = () => {
                    const id = crypto.randomUUID();
                    setImages((prev) => [
                        ...prev,
                        {
                            id,
                            src,
                            width: img.width,
                            height: img.height,
                            x: startX + idx * 30,
                            y: startY + idx * 30,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                        },
                    ]);
                };
                img.src = src; // triggers load
            };
            reader.readAsDataURL(file);
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
            <Button
                onClick={() => {
                    const input = document.querySelector("input[type='file']") as HTMLInputElement;
                    input?.click();
                }}
            >
                Upload
            </Button>
        </div>
    );
}