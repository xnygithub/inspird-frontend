"use client"
import "@/components/posts/posts.css"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"
import { ChevronDown } from 'lucide-react';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { FolderDropdown as FolderDropdownType } from "@/types/folders";
import { getFolderDropdown } from "@/lib/queries/folders"
import { useInView } from "react-intersection-observer";
import { deletePostFromFolder, savePostToFolder } from "@/lib/queries/folders";
import { Item } from "@/components/posts/item"
import { quickSavePost } from "@/lib/queries/posts"

const supabase = createClient();

function FolderList({ postId }: { postId: string }) {
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } = useOffsetInfiniteScrollQuery(
        () => getFolderDropdown(supabase, postId),
        {
            pageSize: 10,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const handleSave = async (folderId: string) => {
        const { data, error } = await quickSavePost(supabase, postId)
        if (error) throw new Error(error.message)
        if (!data) throw new Error("Failed to save post")
        const savedItemsId = data.id

        const { error: saveError } = await savePostToFolder(supabase, savedItemsId, folderId, postId)
        if (saveError) throw new Error(saveError.message)
    }


    const handleDelete = async (folderId: string) =>
        await deletePostFromFolder(supabase, folderId, postId)

    useEffect(() => {
        if (inView && !isValidating && loadMore) loadMore();
    }, [inView, loadMore, isValidating]);

    const folders = (data ?? []) as unknown as FolderDropdownType[];

    return (
        <>
            {folders && folders.map((folder) => {
                return (
                    <Item
                        key={folder.id}
                        folder={folder}
                        handleSave={handleSave}
                        handleDelete={handleDelete} />
                )
            })}
            {!isValidating && loadMore && <div ref={ref} />}
            <div ref={ref} />
        </>
    );
}

export const SaveLabel = ({ postId }: { postId: string }) => {
    const [open, setOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <Popover
            open={open}
            onOpenChange={(v) => {
                setOpen(v);            // important: use v, not !open
                if (v) setHasOpened(true);
            }}
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