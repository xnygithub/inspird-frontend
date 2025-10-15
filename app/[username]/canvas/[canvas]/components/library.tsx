
"use client";
import { createClient } from "@/utils/supabase/client";
import { getUsersPosts } from "@/lib/queries/posts";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Masonry } from 'masonic';
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { useInView } from "react-intersection-observer";
import { AddPostProps } from "@/types/canvas";
import { MasonryItem } from "@/components/posts/masonry-item";

const PAGE_SIZE = 10;
const supabase = createClient();

interface LibraryProps {
    userId: string;
    addPost: (posts: AddPostProps["post"][]) => void;
}
export default function UsersPostsLibrary({ userId, addPost }: LibraryProps) {
    const [selectedPosts, setSelectedPosts] = useState<AddPostProps["post"][]>([]);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getUsersPosts(supabase, userId),
            { pageSize: PAGE_SIZE }
        );

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])


    if (data?.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }

    const handleSelectPost = (post: AddPostProps["post"]) => {
        if (selectedPosts.includes(post)) {
            setSelectedPosts(selectedPosts.filter((p) => p !== post));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }
    }

    const handleClearSelectedPosts = () => setSelectedPosts([]);

    return (
        <div className="flex flex-col h-full">
            <Masonry
                items={data}
                rowGutter={15}
                columnGutter={15}
                columnWidth={250}
                render={MasonryItem}
            />
            {!isValidating && loadMore && <div ref={ref}></div>}
            <div className="flex justify-center mt-auto">
                <Button onClick={() => { addPost(selectedPosts); handleClearSelectedPosts() }}>
                    Add Post
                </Button>
            </div>
        </div>
    );
}
