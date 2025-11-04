import { Input } from '@/components/ui/input';
import { useStore } from '../features/store';
import { HexColorPicker } from 'react-colorful';
import React, { useState, useEffect } from 'react'
import { GroupWrapper } from '../features/types';


//TODO: Consider using https://alabsi91.github.io/reanimated-color-picker/docs/intro

const GroupEditor = () => {
    const group = useStore((s) => s.group);
    const open = useStore((s) => s.editorOpen);
    const [name, setName] = useState("");

    const onChange = (text: string) => setName(text);
    const onSubmit = () => {
        if (!group) return;
        group.setTitle(name);
    }

    const onColorChange = (color: string) => {
        if (!group) return;
        group.setColor(color);
    }

    useEffect(() => {
        if (!group) return;
        setName(group.getTitle());
    }, [group]);

    if (!open || !group) return null;

    return (
        <>
            {open ? <div className="flex flex-col gap-2 mt-auto p-2">
                <span className="font-bold text-sm">Group</span>
                <div className='bg-white/30 w-full h-[1px]'></div>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (name.trim() === '') return;
                            e.preventDefault();
                            onSubmit();
                        }
                    }}
                />
                <div className="flex justify-center w-full h-full">
                    <HexColorPicker
                        color={group?.getColor() || '#000000'}
                        onChange={(color) => onColorChange(color)}
                        className="p-2 h-full"
                    />
                </div>
            </div> : null}
        </>
    )
}

const GroupEditPopover = ({ group }: { group: GroupWrapper }) => {
    const [name, setName] = useState<string>(group.getTitle());

    const onChange = (text: string) => setName(text);
    const onSubmit = () => {
        if (!group) return;
        group.setTitle(name);
    }

    const onColorChange = (color: string) => {
        if (!group) return;
        group.setColor(color);
    }

    useEffect(() => {
        if (!group) return;
        setName(group.getTitle());
    }, [group]);

    if (!group) return null;

    return (
        <div className="flex flex-col gap-2 mt-auto p-2">
            <span className="font-bold text-sm">Group</span>
            <div className='bg-white/30 w-full h-[1px]'></div>
            <Input
                type="text"
                value={name}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (name.trim() === '') return;
                        e.preventDefault();
                        onSubmit();
                    }
                }}
            />
            <div className="flex justify-center w-full h-full">
                <HexColorPicker
                    color={group?.getColor() || '#000000'}
                    onChange={(color) => onColorChange(color)}
                    className="p-2 h-full"
                />
            </div>
        </div>
    )
}


export default GroupEditor
export { GroupEditPopover }