"use client"
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Database } from "@/database.types";
import { MasonryGrid } from "./masonry-grid";
import { ProfilePostsType } from "@/types/posts";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { UserMasonryItem } from '@/components/posts/masonry-item'
import { SortValue, useProfile } from '@/app/(app)/[username]/components/provider';
import { useInView } from "react-intersection-observer";

function getPosts(
    client: SupabaseClient<Database>,
    userId: string
): ReturnType<typeof client.rpc> {
    return client.rpc("get_posts", { user_uuid: userId }).select("*");
}

function getPostsQuery(
    client: SupabaseClient<Database>,
    userId: string,
    sort: SortValue
): ReturnType<typeof getPosts> {
    return getPosts(client, userId)
        .order('createdAt', { ascending: sort === 'latest' ? false : true })

}

function useMakeRequest(
    query: () => ReturnType<typeof getPostsQuery>,
    limit: number = 50,
) {

    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<ProfilePostsType[]>([]);


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

export const PinTab = () => {
    const supabase = createClient();
    const { user, sort, isMe } = useProfile();
    const { ref, inView } = useInView({ threshold: 0 });

    const { items, isLoading, fetchMore, hasMore } = useMakeRequest(
        () => getPostsQuery(supabase, user.id, sort.pins));

    useEffect(() => {
        if (isLoading || !hasMore) return;
        if (inView) fetchMore();
    }, [inView, isLoading, hasMore, fetchMore]);

    // useEffect(() => {
    //     fetchMore();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <>
            <MasonryGrid
                gap={12}
                columns={2}
                columnBreakpoints={[
                    { minWidth: 0, columns: 2 },
                    { minWidth: 600, columns: 3 },
                    { minWidth: 1000, columns: 4 },
                    { minWidth: 1400, columns: 6 },
                    { minWidth: 1800, columns: 8 },
                ]}
                getItemHeight={(child, index) => {
                    if (!React.isValidElement(child)) return 0;

                    const data = (child as React.ReactElement<{ data: ProfilePostsType }>).props.data;
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
                        isMe={isMe}
                    />
                ))}
            </MasonryGrid>
            {isLoading &&
                <div className="flex justify-center mt-4 mb-8">
                    <Loader2 className="size-4 animate-spin" />
                </div>}
            {!isLoading && hasMore &&
                <div ref={ref} className="mb-2 h-[1px]" />
            }
        </>
    )
}

export default PinTab;