import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// TODO: When tagging feature is implemented, 
// allow users to search their pins by tags
const Search = (
    { open }: { open: boolean }
) => {
    return (
        <div
            className={cn(
                "w-full transition-all duration-500",
                open ?
                    'opacity-100 translate-y-0' :
                    'opacity-0 -translate-y-full')}>
            <Input type="text" placeholder="Search" hidden={!open} className='rounded-full' />
        </div>
    )
}

export default Search