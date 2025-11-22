'use client'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const mockSections: string[] = ["anime", "manga", "music", "games", "movies", "tv", "books", "other"];

const Sections = ({
    sections = mockSections
}: {
    sections?: string[];
}
) => {
    const allSections = ['All', ...sections];
    const [selected, setSelected] = useState<string | null>('All');

    return (
        <ul className='flex flex-wrap gap-2 font-sans transition-all duration-1000'>
            {allSections && allSections.map((section) => (
                <li key={section} onClick={() => setSelected(section)}
                    className={
                        cn("w-fit text-base", selected === section ?
                            'text-primary  underline underline-offset-4 decoration-2' : 'text-muted-foreground cursor-pointer',
                            'hover:text-primary transition-colors duration-300')}>
                    {section}
                </li>
            ))}
        </ul>
    )
}

export default Sections