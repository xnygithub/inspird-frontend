"use client"
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useInView } from "react-intersection-observer";
import { MasonryItem } from '@/components/posts/masonry-item'
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

const supabase = createClient();
const Masonry = dynamic(() => import('masonic').then(m => m.Masonry), { ssr: false });

export const getPosts = (
    client: SupabaseClient<Database>,
    userId: string
) => {
    return client.rpc("get_posts", { user_uuid: userId }).select("*");
}

export default function PinsContainer(
    { userId, sort }: { userId: string, sort: 'newest' | 'oldest' }
) {
    const { ref, inView } = useInView({ threshold: 0 });
    const ascending = sort === 'oldest' ? true : false;
    const { data, isValidating, loadMore } =
        useOffsetInfiniteScrollQuery(
            () => getPosts(supabase, userId)
                .order('createdAt', { ascending }),
            { pageSize: 10, revalidateFirstPage: false });


    const items = data ?? [];
    const hasMore = !isValidating && !!loadMore;

    useEffect(() => {
        if (inView && hasMore) loadMore()
    }, [inView, loadMore, hasMore])

    if (!loadMore && !isValidating && items.length === 0) {
        return <div className="mt-10 text-center">This user hasn&apos;t posted anything yet</div>
    }

    return (
        <>
            <Masonry
                key={sort}
                items={items}
                rowGutter={15}
                columnGutter={15}
                columnWidth={250}
                render={(MasonryItem)}
            />
            {hasMore && <div ref={ref} style={{ height: 1 }} />}
        </>
    )

}   