"use client"
import "@/components/posts/posts.css"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { getFolderList } from "@/lib/client/folders";
import Image from "next/image";
import gray from "@/public/gray.png";
import { Plus } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { savePostToFolder } from "./actions"
import { GetUsersPostsResult } from "@/lib/client/posts"

const supabase = createClient();
const PAGE_SIZE = 10;

export const SaveLabel = ({ post }: { post: GetUsersPostsResult }) => {
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [hydrated, setHydrated] = useState(false)
    const { ref, inView } = useInView({ threshold: 0 });

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });
    }, []);

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            // TODO: Investigate "!" enforce type safety
            () => (userId && open ? getFolderList(supabase, userId) : null)!,
            { pageSize: PAGE_SIZE }
        );

    const handleSave = async (folderId: string) => {
        await savePostToFolder(folderId, post.posts.id)
    }


    useEffect(() => {
        if (inView && !isValidating && loadMore) {
            loadMore()
        }
    }, [inView, loadMore, isValidating])

    useEffect(() => setHydrated(true), [])
    if (!hydrated) return null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button><ChevronDown /></Button>
            </PopoverTrigger>
            <PopoverContent id="popover-content">
                {data && <>
                    {data.map((folder) => {
                        return (
                            <div id="folder-item-container" key={folder.id}>
                                <div id="folder-item">
                                    <Image
                                        width={50}
                                        height={50}
                                        src={folder.thumbnail || gray}
                                        alt={"Folder Thumbnail"}
                                    />
                                    <div id="folder-item-name">
                                        <p>{folder.name}</p>
                                        <p>{folder.folder_posts[0].count} Items </p>
                                        <p>{folder.isPrivate ? "(Private)" : "Public"}</p>
                                    </div>
                                </div>
                                <Plus onClick={() => handleSave(folder.id)} />
                            </div>
                        )
                    })}</>
                }
                {!isValidating && loadMore && <div ref={ref} />}
            </PopoverContent>
        </Popover>
    )
}