"use client"

import React from 'react'
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { deleteQuery } from '@/lib/queries/search';
import { createClient } from '@/utils/supabase/client';
import { useUserContext } from '@/components/userContext';

interface Props {
    query: { id: string, query: string };
    setQuery: (query: string) => void;
}

export default function Recent(
    { query: { id, query }, setQuery }: Props
) {
    const { history, setHistory } = useUserContext();
    const handleDelete = async () => {
        const supabase = createClient();
        await deleteQuery(supabase, id);
        setHistory(history?.filter((item) => item.id !== id) ?? []);
    }
    return (
        <li className={cn(
            "group flex flex-row items-center gap-1",
            "bg-[#C9C9C9] hover:bg-white/95 text-background whitespace-nowrap",
            "px-4 py-0.75 rounded-full w-fit text-md  font-sans cursor-pointer select-none")}>
            <span onClick={() => setQuery(query)}>
                {query}
            </span>
            <button className="hidden group-hover:block opacity-0 group-hover:opacity-100 cursor-pointer">
                <X className="w-4 h-4" onClick={handleDelete} />
            </button>
        </li >
    )
};
