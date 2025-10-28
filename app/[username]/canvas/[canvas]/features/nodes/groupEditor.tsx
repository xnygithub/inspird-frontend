import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { useCanvasStore } from '../store';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GroupEditor = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#000000');
    const { group, setEditorOpen } = useCanvasStore();

    useEffect(() => {
        setName(group?.getGroupName() || '');
        setColor(group?.getColor() || '#000000');
    }, [group]);

    const onChange = (text: string) => setName(text);
    const onSubmit = () => group?.updateText(name);
    const onColor = (color: string) => group?.setColor(color);
    const onClose = () => setEditorOpen(false);


    if (!group) return null;

    return (
        <div className="top-20 right-4 z-10 absolute flex flex-col items-center gap-2 bg-black p-2 w-50">
            <div className="relative flex justify-center items-center gap-2 my-2 w-full">
                <span className="font-bold text-sm">Edit Group</span>
                <Button
                    variant="icon"
                    onClick={onClose}
                    className="top-1/2 right-0 absolute -translate-y-1/2">
                    <X />
                </Button>
            </div>
            <Input
                type="text"
                value={name}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSubmit();
                    }
                }}
            />
            <div className="flex justify-center w-full h-full">
                <HexColorPicker
                    color={color}
                    onChange={onColor}
                    className="p-2 h-full"
                />
            </div>
        </div>
    )
}

export default GroupEditor