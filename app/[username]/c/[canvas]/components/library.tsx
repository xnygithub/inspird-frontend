
"use client";
import { createClient } from "@/utils/supabase/client";
import { getUsersPosts } from "@/lib/queries/posts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useOffsetInfiniteScrollQuery } from '@supabase-cache-helpers/postgrest-swr';
import { useInView } from "react-intersection-observer";
import { AddPostProps } from "@/types/canvas";
import { PIN_MASONRY } from "@/constants/masonry";

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
            <ResponsiveMasonry columnsCountBreakPoints={PIN_MASONRY}>
                <Masonry>
                    {data && data.map((post) => (
                        <div
                            className="group relative w-full"
                            key={post.posts.id}
                            onClick={() => handleSelectPost(post.posts)}
                        >
                            {selectedPosts.includes(post.posts) && <Check className="top-2 right-2 absolute w-4 h-4" />}
                            <Image
                                loading="lazy"
                                className="object-cover"
                                alt={post.posts.mediaAltText}
                                src={post.posts.mediaUrl}
                                width={post.posts.mediaWidth}
                                height={post.posts.mediaHeight}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    ))}

                </Masonry>
            </ResponsiveMasonry>
            {!isValidating && loadMore && <div ref={ref}></div>}
            <div className="flex justify-center mt-auto">
                <Button onClick={() => { addPost(selectedPosts); handleClearSelectedPosts() }}>
                    Add Post
                </Button>
            </div>
        </div>
    );
}
