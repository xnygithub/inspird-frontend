'use client'
import { Info } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { deletePost } from '@/lib/queries/posts'

export default function Edit({ postId }: { postId: string }) {

    const handleDelete = async () => {
        const supabase = await createClient()
        const { error } = await deletePost(supabase, postId)
        if (!error) redirect(`/`)
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
