"use client"
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useInView } from "react-intersection-observer";
import { MasonryItem } from '@/components/posts/masonry-item'
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { useProfile } from '@/app/[username]/components/provider';

const supabase = createClient();
const Masonry = dynamic(() => import('masonic').then(m => m.Masonry), { ssr: false });

export const getPosts = (
    client: SupabaseClient<Database>,
    userId: string
) => {
    return client.rpc("get_posts", { user_uuid: userId }).select("*");
}



export const PinTab = () => {
    const { user, sort } = useProfile();
    const { ref, inView } = useInView({ threshold: 0 });
    const { data, isValidating, loadMore } =
        useOffsetInfiniteScrollQuery(
            () => getPosts(supabase, user.id)
                .order('createdAt', { ascending: sort.pins === 'latest' ? false : true }),
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
                key={sort.pins}
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

export default PinTab;