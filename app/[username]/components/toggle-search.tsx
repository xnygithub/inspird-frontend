

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React from 'react'

const ToggleSearch = (
    { open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }
) => {
    return (
        <Button
            variant="ghost"
            className='rounded-full active:translate-y-0.5'
            onClick={() => setOpen(!open)}>
            <Search />
        </Button>
    )
}

export default ToggleSearch
