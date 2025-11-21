"use client"
import Image from 'next/image'
import gray from '@/public/gray.png'
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from "react"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'
import { quickSavePost } from "@/lib/queries/posts"
import { createClient } from "@/utils/supabase/client"
import type { FolderDropdown } from "@/types/folders";
import { SupabaseClient } from '@supabase/supabase-js';
import { useInView } from "react-intersection-observer";
import { getFolderDropdown } from "@/lib/queries/folders"
import { deletePostFromFolder, savePostToFolder } from "@/lib/queries/folders";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';


async function handleSave(
    supabase: SupabaseClient,
    postId: string,
    folderId: string
) {
    // TODO: Handle this in a transaction, ideally with RPC
    const { data, error } = await quickSavePost(supabase, postId)
    if (error || !data) return
    await savePostToFolder(supabase, data.id, folderId, postId)
}

async function handleDelete(
    supabase: SupabaseClient,
    postId: string,
    folderId: string
) {
    await deletePostFromFolder(supabase, folderId, postId)
}


function DefaultSave({ postId }: { postId: string }) {
    const supabase = createClient();

    async function handleDefaultSave() {
        const { error } = await quickSavePost(supabase, postId)
        if (error) return false;
        return true;
    }

    return (
        <li
            key="default-save"
            style={itemStyle}
            className='hover:bg-accent/50 px-2.5 py-2 rounded-md cursor-pointer'>
            <div className='flex justify-between items-center gap-2'>
                <Image
                    src={gray}
                    width={40}
                    height={40}
                    className='rounded-xs object-cover'
                    alt={"Folder Thumbnail"}
                />
                <div className='space-y-1 font-sans text-xs'>
                    <div>Default Save</div>
                </div>
            </div>
            <Button
                onClick={handleDefaultSave}
                variant="secondary"
                className='text-xs'>
                Save
            </Button>
        </li>

    )
}

function FolderList({ postId }: { postId: string }) {
    const supabase = createClient();

    const [search, setSearch] = useState("");
    const { ref, inView } = useInView({ threshold: 0 });
    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(() =>
            getFolderDropdown(supabase, postId), { pageSize: 30 }
        );

    const items = data as unknown as FolderDropdown[] ?? [];
    const hasMore = !isValidating && !!loadMore;

    function filterFolders(items: FolderDropdown[]) {
        return items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    useEffect(() => {
        if (inView && hasMore) loadMore();
    }, [inView, loadMore, hasMore]);

    return (
        <div className='space-y-4 mt-4'>
            <div className='px-2.5'>
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={inputStyle}
                    placeholder="Search folders"
                    className='px-4 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 font-sans text-primary text-xs md:text-xs placeholder:text-xs'
                />
            </div>
            <ul >
                <DefaultSave postId={postId} />
                {items?.length > 0 && filterFolders(items).map((folder) => (
                    <FolderItem
                        key={folder.id as string}
                        folder={folder}
                        postId={postId} />
                ))}
                {hasMore && <div ref={ref} />}
            </ul>
        </div>
    );
}

function FolderItem({
    folder,
    postId
}: {
    folder: FolderDropdown
    postId: string
}
) {
    // TODO: Show thumnail when available
    const supabase = createClient()
    const [isSaved, setIsSaved] = useState(folder.containsPost)

    function handleClick() {
        if (isSaved) {
            handleDelete(supabase, postId, folder.id)
            setIsSaved(false)
        } else {
            handleSave(supabase, postId, folder.id)
            setIsSaved(true)
        }
    }

    return (
        <li key={folder.id}
            style={itemStyle}
            className='hover:bg-accent/50 px-2.5 py-2 rounded-md cursor-pointer'>
            <div className='flex justify-between gap-2'>
                <Image
                    src={gray}
                    width={40}
                    height={40}
                    className='rounded-xs object-cover'
                    alt={"Folder Thumbnail"}
                />
                <div className='space-y-1 font-sans text-xs'>
                    <div>{folder.name}</div>
                    <div className="text-muted-foreground">{folder.postCount} Items</div>
                </div>
            </div>
            <Button
                onClick={handleClick}
                variant="secondary"
                className='text-xs'>
                {isSaved ? "Unsave" : "Save"}
            </Button>
        </li>
    )
}


export function FolderSave(
    { postId }: { postId: string }
) {
    const [open, setOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    function handleOpenChange(v: boolean) {
        setOpen(v);
        if (v) setHasOpened(true);
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="icon">
                    <ChevronDown size={16} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="mb-4 rounded-md animate-none!"
                style={popoverStyle}>
                <span className="block font-sans text-primary text-sm text-center">
                    Add to Folder
                </span>
                {open && hasOpened ? <FolderList postId={postId} /> : null}
            </PopoverContent>
        </Popover>
    );
}


const inputStyle: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    width: '100%',
}

const itemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const popoverStyle: React.CSSProperties = {
    overflowY: 'auto',
    padding: '0.25rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '1.5rem',
    height: '425px',
    width: '290px',
    backgroundColor: 'var(--popover)',
}