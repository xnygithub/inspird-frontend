'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowDownUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    setSort: (sort: string) => void
}

const Sort = (
    { setSort }: Props
) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='rounded-full active:translate-y-0.5'>
                    <ArrowDownUp size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSort('latest')}>
                    Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort('oldest')}>
                    Oldest
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Sort