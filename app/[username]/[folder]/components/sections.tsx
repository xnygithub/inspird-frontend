'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'


const mockSections: string[] = ["anime", "manga", "music", "games", "movies", "tv", "books", "other"];

interface Props {
    sections?: string[];
}

const Sections = (
    { sections = mockSections }: Props
) => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <ul className='flex flex-wrap gap-2 font-sans text-lg transition-all duration-1000'>
            {sections && sections.map((section) => (
                <li key={section} onClick={() => setSelected(section)}
                    className={
                        cn(selected === section ? 'text-primary px-2' : 'text-muted-foreground cursor-pointer',
                            'hover:text-primary transition-colors duration-300')}>
                    {section}
                </li>
            ))}
        </ul>
    )
}

export default Sections