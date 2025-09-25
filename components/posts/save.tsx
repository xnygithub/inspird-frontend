"use client"
import "@/components/posts/posts.css"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { getFolderListForPostId } from "@/lib/queries/folders";
import { useInView } from "react-intersection-observer";
import { savePostToFolder } from "./actions"
import { deletePostFromFolder } from "@/lib/queries/folders";
import { Item } from "./item"

const supabase = createClient();
const PAGE_SIZE = 10;

export const SaveLabel = ({ postId }: { postId: string }) => {
    const [open, setOpen] = useState(false)
    const [hasOpened, setHasOpened] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const { ref, inView } = useInView({ threshold: 0 });

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });
    }, []);

    const { data, loadMore, isValidating } = useOffsetInfiniteScrollQuery(
        () => (userId && hasOpened ? getFolderListForPostId(supabase, userId, postId) : null),
        {
            pageSize: PAGE_SIZE,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    const handleSave = async (folderId: string) => {
        await savePostToFolder(folderId, postId)
    }

    const handleDelete = async (folderId: string) => {
        if (!userId) return
        await deletePostFromFolder(supabase, userId, folderId, postId)
    }

    useEffect(() => {
        if (inView && !isValidating && loadMore) {
            loadMore()
        }
    }, [inView, loadMore, isValidating])

    return (
        <Popover open={open} onOpenChange={(v) => {
            setOpen(!open)
            if (v) setHasOpened(true)
        }}>
            <PopoverTrigger asChild>
                <Button><ChevronDown /></Button>
            </PopoverTrigger>
            <PopoverContent id="popover-content">
                {data && data.map((folder) => {
                    return (
                        <Item
                            key={folder.id}
                            folder={folder}
                            handleSave={handleSave}
                            handleDelete={handleDelete} />
                    )
                })}
                {!isValidating && loadMore && <div ref={ref} />}
            </PopoverContent>
        </Popover >
    )
}