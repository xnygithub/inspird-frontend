"use client"
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client'
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { FolderWithCounts } from '@/types/folders'
import { MasonryItem } from '@/components/posts/masonry-item'
import { useInfiniteLoader } from 'masonic';
import { SupabaseClient } from '@supabase/supabase-js';

const Masonry = dynamic(() => import('masonic').then(m => m.Masonry), {
    ssr: false,
});

const supabase = createClient();

const getFolderPosts = (client: SupabaseClient, f_id: string) => {
    return client.rpc('get_folder_posts', { f_id });
}

export default function FolderPosts(
    { folder }: { folder: FolderWithCounts }
) {
    console.log(folder);
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
    console.log(data);

    return (
        <div className='mt-8'>
            {data?.length ? (
                <Masonry
                    items={data}
                    rowGutter={15}
                    columnGutter={15}
                    columnWidth={200}
                    onRender={maybeLoadMore}
                    render={MasonryItem}
                />
            ) : null}
        </div>
    )
}