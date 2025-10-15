"use client"
import "@/components/posts/posts.css"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"
import { ChevronDown } from 'lucide-react';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { getFolderDropdown } from "@/lib/queries/folders"
import { useInView } from "react-intersection-observer";
import { FolderDropdown } from "@/types/folders";
import { deletePostFromFolder, savePostToFolder } from "@/lib/queries/folders";
import { FolderItem } from "@/components/posts/item"
import { quickSavePost } from "@/lib/queries/posts"



function FolderList({ postId }: { postId: string }) {
    const supabase = createClient();
    const { ref, inView } = useInView({ threshold: 0 });
    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(() =>
            getFolderDropdown(supabase, postId), { pageSize: 10 }
        );

    const items = data as unknown as FolderDropdown[] ?? [];
    const hasMore = !isValidating && !!loadMore;

    const handleSave = async (folderId: string) => {
        // TODO: Handle this in a transaction, ideally with RPC
        const { data, error } = await quickSavePost(supabase, postId)
        if (error || !data) return
        await savePostToFolder(supabase, data.id, folderId, postId)
    }


    const handleDelete = async (folderId: string) =>
        await deletePostFromFolder(supabase, folderId, postId)

    useEffect(() => {
        if (inView && hasMore) loadMore();
    }, [inView, loadMore, hasMore]);

    return (
        <>
            {items?.length > 0 && items.map((folder) => {
                return (
                    <FolderItem
                        key={folder.id as string}
                        folder={folder}
                        handleSave={handleSave}
                        handleDelete={handleDelete} />
                )
            })}
            {hasMore && <div ref={ref} />}
        </>
    );
}

export const FolderSave = (
    { postId }: { postId: string }
) => {
    const [open, setOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <Popover
            open={open}
            onOpenChange={(v) => { setOpen(v); if (v) setHasOpened(true) }}
        >
            <PopoverTrigger asChild>
                <button><ChevronDown size={16} /></button>
            </PopoverTrigger>
            <PopoverContent id="popover-content">
                {open && hasOpened ? <FolderList postId={postId} /> : null}
            </PopoverContent>
        </Popover>
    );
};