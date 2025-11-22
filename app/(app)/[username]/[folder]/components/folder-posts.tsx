"use client"
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Database } from '@/database.types';
import { FolderPostsType } from '@/types/posts';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js';
import { UserMasonryItem } from '@/components/posts/masonry-item'
import { MasonryGrid } from '@/app/(app)/[username]/components/masonry-grid';

function getFolderPosts(
    client: SupabaseClient<Database>,
    f_id: string
) {
    return client.rpc('get_folder_posts', { f_id });
}

function useMakeRequest(
    query: () => ReturnType<typeof getFolderPosts>,
    limit: number = 50,
) {

    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState<FolderPostsType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchMore() {
        if (!hasMore || isLoading) return;
        setIsLoading(true);
        const nextItems = await query().range(
            items.length,
            items.length + limit - 1
        );
        if (nextItems.data?.length !== limit) {
            setHasMore(false);
        }
        setItems((prev) => [...prev, ...nextItems.data ?? []]);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }

    return { fetchMore, isLoading, hasMore, items }
}

export default function FolderPosts({
    folderId
}: {
    folderId: string
}) {
    const supabase = createClient();

    const { items, isLoading, fetchMore, hasMore } = useMakeRequest(() =>
        getFolderPosts(supabase, folderId)
    );

    return (
        <>
            <MasonryGrid
                columns={2} // fallback
                gap={12}
                columnBreakpoints={[
                    { minWidth: 0, columns: 2 },
                    { minWidth: 600, columns: 3 },
                    { minWidth: 1000, columns: 4 },
                    { minWidth: 1400, columns: 6 },
                    { minWidth: 1800, columns: 8 },
                ]}
                getItemHeight={(child, _) => {
                    if (!React.isValidElement(child)) {
                        return 0;
                    }
                    const data = (child as React.ReactElement<{ data: FolderPostsType }>).props.data;
                    const h = data.mediaHeight;
                    const w = data.mediaWidth;
                    if (!h || !w) return 0;
                    return (h / w);
                }}
            >
                {items.map((item) => (
                    <UserMasonryItem
                        key={item.id}
                        data={item}
                        isMe={false}
                    />
                ))}
            </MasonryGrid>
            <div className="flex justify-center mt-4 mb-8">
                <Button
                    variant="secondary"
                    onClick={fetchMore}
                    disabled={isLoading || !hasMore}
                    className="inline-flex gap-2 py-3 rounded-full w-36 h-fit cursor-pointer">
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    {hasMore ? "Load More" : "No more posts"}
                </Button>
            </div>
        </>
    )
}