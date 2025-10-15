

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const ToggleSearch = (
    { open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }
) => {
    const disabled = true;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    className='rounded-full active:translate-y-0.5'
                    onClick={() => !disabled && setOpen(!open)}>
                    <Search />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Coming soon</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ToggleSearch
