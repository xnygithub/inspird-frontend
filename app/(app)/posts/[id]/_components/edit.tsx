'use client'
import { Info } from 'lucide-react';
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client'
import { deletePost, deletePostFromStorage } from '@/lib/queries/posts'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger }
    from "@/components/ui/dropdown-menu";


export default function Edit(
    { postId, urlPath }: { postId: string, urlPath: string }
) {
    const handleDelete = async () => {
        const supabase = await createClient()
        const { error } = await deletePost(supabase, postId)
        if (!error) {
            const { error: storageError } = await deletePostFromStorage(supabase, urlPath)
            if (!storageError) redirect(`/`)
        }
    }
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button >
                    <Info />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
