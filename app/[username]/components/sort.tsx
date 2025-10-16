'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowDownUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/app/[username]/components/provider';


interface Props {
    tab: 'pins' | 'folders' | 'canvas';

}


export const Sort = ({ tab }: Props) => {
    const { sort, handleSort } = useProfile();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full active:translate-y-0.5">
                    <ArrowDownUp />
                    <span className="ml-1 text-sm">{sort[tab] === 'latest' ? 'Latest' : 'Oldest'}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort(tab, 'latest')}>
                    {sort[tab] === 'latest' && <Check size={16} className="mr-2" />}
                    {sort[tab] !== 'latest' && <span className="mr-2 w-4" />} {/* alignment shim */}
                    Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort(tab, 'oldest')}>
                    {sort[tab] === 'oldest' && <Check size={16} className="mr-2" />}
                    {sort[tab] !== 'oldest' && <span className="mr-2 w-4" />}
                    Oldest
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};