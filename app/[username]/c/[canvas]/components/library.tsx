
"use client";
import { createClient } from "@/utils/supabase/client";
import { getUsersPosts, GetUsersPostsResult } from "@/lib/client/posts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";


export default function Library({ addPost }: { addPost: (posts: GetUsersPostsResult["posts"][]) => void }) {
    const [posts, setPosts] = useState<GetUsersPostsResult[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<GetUsersPostsResult["posts"][]>([]);

    const handleFetchPosts = async () => {
        const supabase = await createClient();
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
            throw new Error("User not found")
        }
        const userId = user.user.id
        const posts = await getUsersPosts(userId, 0, 10);
        setPosts(posts);
    }

    const handleSelectPost = (post: GetUsersPostsResult["posts"]) => {
        if (selectedPosts.includes(post)) {
            setSelectedPosts(selectedPosts.filter((p) => p.id !== post.id));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }
    }

    useEffect(() => {
        handleFetchPosts();
    }, []);

    const handleClearSelectedPosts = () => {
        setSelectedPosts([]);
    }

    return (
        <div className="flex flex-col h-full">
            <ResponsiveMasonry columnsCountBreakPoints={{ 250: 2, 500: 2, 750: 3, 1000: 4, 1250: 5, 1500: 6 }}>
                <Masonry>
                    {posts.map((post) => (
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
            <div className="flex justify-center mt-auto">
                <Button onClick={() => { addPost(selectedPosts); handleClearSelectedPosts() }}>
                    Add Post
                </Button>
            </div>
        </div>
    );
}
