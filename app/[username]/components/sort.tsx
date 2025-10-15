'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowDownUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TabKey = 'pins' | 'folders' | 'canvas';
type SortValue = 'latest' | 'oldest';
type SortState = Record<TabKey, SortValue>;

interface Props {
    tab: TabKey;
    sort: SortValue;
    setSort: React.Dispatch<React.SetStateAction<SortState>>;
}


export const Sort = ({ tab, sort, setSort }: Props) => {
    const handleSort = (value: SortValue) => {
        setSort((prev) => ({ ...prev, [tab]: value }));
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full active:translate-y-0.5">
                    <ArrowDownUp />
                    <span className="ml-1 text-sm">{sort === 'latest' ? 'Latest' : 'Oldest'}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort('latest')}>
                    {sort === 'latest' && <Check size={16} className="mr-2" />}
                    {sort !== 'latest' && <span className="mr-2 w-4" />} {/* alignment shim */}
                    Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('oldest')}>
                    {sort === 'oldest' && <Check size={16} className="mr-2" />}
                    {sort !== 'oldest' && <span className="mr-2 w-4" />}
                    Oldest
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};