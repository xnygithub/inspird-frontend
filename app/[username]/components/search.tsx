"use client"
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useProfile } from './provider'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const ToggleSearch = (
) => {
    const { searchOpen, setSearchOpen } = useProfile();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    className='rounded-full active:translate-y-0.5'
                    onClick={() => setSearchOpen(!searchOpen)}>
                    <Search />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Coming soon</p>
            </TooltipContent>
        </Tooltip>
    )
}

export const SearchBar = (
) => {
    const { searchOpen } = useProfile();
    return (
        <div
            className={cn(
                "w-full transition-all duration-500",
                searchOpen ?
                    'opacity-100 translate-y-0' :
                    'opacity-0 -translate-y-full')}>
            <Input
                type="text"
                placeholder="Search"
                hidden={!searchOpen}
                className='rounded-full'
            />
        </div>
    )
}
