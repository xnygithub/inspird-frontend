"use client";
import React from 'react'
import { cn } from '@/lib/utils'
import AddPosts from './import'
import { useCanvas } from '../provider'
import { Save, TextCursorIcon, PencilIcon, MoveUpRightIcon, UploadIcon, RepeatIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Toolbar = () => {
    const { handleSaveCanvas, resetCamera } = useCanvas();
    return (
        <div className={
            cn('top-1/2 right-4 z-50 absolute -translate-y-1/2',
                'flex flex-col items-center gap-2 py-4 ',
                'w-[4rem] h-fit',
                'bg-popover border-2')}>
            <AddPosts />
            <Button size="icon" onClick={handleSaveCanvas}>
                <UploadIcon className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleSaveCanvas}>
                <Save className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleSaveCanvas}>
                <TextCursorIcon className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleSaveCanvas}>
                <PencilIcon className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleSaveCanvas}>
                <MoveUpRightIcon className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={resetCamera}>
                <RepeatIcon className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default Toolbar