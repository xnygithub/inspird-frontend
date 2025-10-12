"use client"
import dynamic from 'next/dynamic';
import { getFolderPosts } from '@/lib/queries/folders'
import { createClient } from '@/utils/supabase/client'
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { FolderDetails } from '@/types/folders'
import { FolderMasonryItem } from '@/components/posts/masonry-item'
import { useInfiniteLoader } from 'masonic';

const Masonry = dynamic(() => import('masonic').then(m => m.Masonry), {
    ssr: false,
});

const supabase = createClient();

export default function FolderPosts({ folder }: { folder: FolderDetails }) {

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getFolderPosts(supabase, folder.id),
            { pageSize: 20 }
        );
    const items = data ?? [];
    const hasMore = !isValidating && !!loadMore;

    const maybeLoadMore = useInfiniteLoader(
        async () => { if (hasMore) loadMore(); },
        {
            isItemLoaded: (index, items) => !!items[index],
            totalItems: hasMore ? items.length + 1 : items.length,

        }
    );

    return (
        <div className='mt-8'>
            {data?.length ? (
                <Masonry
                    items={data}
                    rowGutter={15}
                    columnGutter={15}
                    columnWidth={200}
                    onRender={maybeLoadMore}
                    render={FolderMasonryItem}
                />
            ) : null}
        </div>
    )
}