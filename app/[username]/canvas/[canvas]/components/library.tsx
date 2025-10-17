
"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Masonry } from 'masonic';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { useInView } from "react-intersection-observer";
import { CanvasItem } from "@/components/posts/masonry-item";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";
import { ProfilePostsType } from "@/types/posts";
import { useCanvas } from "@/app/[username]/canvas/[canvas]/provider";

const PAGE_SIZE = 10;
const supabase = createClient();


export const getPosts = (
    client: SupabaseClient<Database>,
    userId: string
) => {
    return client.rpc("get_posts", { user_uuid: userId }).select("*");
}


export default function UsersPostsLibrary() {
    const { canvas, addPost } = useCanvas();
    const [selectedPosts, setSelectedPosts] = useState<ProfilePostsType[]>([]);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getPosts(supabase, canvas.owner.id),
            { pageSize: PAGE_SIZE }
        );

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    const items = data ?? [];


    if (items.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }

    const handleSelectPost = (post: ProfilePostsType) => {
        if (selectedPosts.includes(post)) {
            setSelectedPosts(selectedPosts.filter((p) => p !== post));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }
    }

    const handleClearSelectedPosts = () => setSelectedPosts([]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center mt-auto">
                <Button onClick={() => { addPost(selectedPosts); handleClearSelectedPosts() }}>
                    Add Post
                </Button>
            </div>
            <Masonry
                items={items}
                rowGutter={15}
                columnGutter={15}
                columnWidth={150}
                render={({ index, data }) => (
                    <CanvasItem
                        index={index}
                        data={data}
                        selectedPosts={selectedPosts}
                        handleSelectPost={handleSelectPost}
                    />
                )}
            />
            {!isValidating && loadMore && <div ref={ref}></div>}
        </div>
    );
}
