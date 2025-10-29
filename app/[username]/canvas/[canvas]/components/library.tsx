
"use client";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useOffsetInfiniteScrollQuery, useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { useInView } from "react-intersection-observer";
import { ProfilePostsType } from "@/types/posts";
import { getMediaUrl } from "@/utils/urls";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/queries/posts";
import { getFoldersSimpleQuery } from "@/lib/queries/folders";
import { addImage } from "../features/nodes/image";
import { KonvaCanvasHandle } from "../features/canvas";


interface Props {
    id: string;
    canvasRef: React.RefObject<KonvaCanvasHandle | null>;
}

export default function Library({ id, canvasRef }: Props) {
    const supabase = createClient();
    const [selectedPosts, setSelectedPosts] = useState<ProfilePostsType[]>([]);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => getPosts(supabase, id),
            { pageSize: 15 }
        );

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    const items = data ?? [];

    const { data: foldersData } = useQuery(
        getFoldersSimpleQuery(supabase, id)
    );

    function selectPost(post: ProfilePostsType) {
        if (selectedPosts.includes(post)) {
            setSelectedPosts(selectedPosts.filter((p) => p !== post));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }
    }

    function addPosts() {
        const layer = canvasRef.current?.getContentLayer();
        const transformer = canvasRef.current?.getTransformer();
        if (!layer || !transformer) return;
        selectedPosts.forEach(async (post) => {
            await addImage(layer, transformer, getMediaUrl(post.mediaUrl));
        });
        setSelectedPosts([])
    }


    if (items.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }


    return (
        <div className="flex flex-row bg-amber-800 w-full h-full">
            <div className="space-y-2 w-[10%] font-sans">
                <h3 className="font-bold text-base">Your Folders</h3>
                <div className="space-y-0 opacity-80 text-sm">
                    {foldersData?.map((folder) => (
                        <div key={folder.id}>{folder.name}</div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col p-2 w-[70%] overflow-y-auto no-scrollbar">
                <ResponsiveMasonry columnsCountBreakPoints={{ 500: 1, 750: 2, 900: 3, 1200: 4, 1500: 5 }}>
                    <Masonry >
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`relative w-full 
                                ${selectedPosts.includes(item) ? 'outline-4 outline-blue-500' : ''}`}
                                onClick={() => selectPost(item)}
                            >
                                <Image
                                    className="object-cover"
                                    alt={item.mediaAltText || ''}
                                    src={getMediaUrl(item.mediaUrl)}
                                    width={item.mediaWidth}
                                    height={item.mediaHeight}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
                {!isValidating && loadMore && <div ref={ref} className="h-[1px]"></div>}
            </div >
            <div className="relative bg-amber-200 w-[20%] h-[100%]">
                <div className="text-center">
                    <span className="inline-block mb-2 font-bold text-sm">Selected Posts</span>
                    <Masonry columnsCount={2} gutter="10px">
                        {selectedPosts.map((post) => (
                            <Image
                                key={post.id}
                                src={getMediaUrl(post.mediaUrl)}
                                alt={post.mediaAltText || ''}
                                width={post.mediaWidth}
                                height={post.mediaHeight}
                                className="object-cover"
                            />
                        ))}
                    </Masonry>
                </div>

                {selectedPosts.length > 0 &&
                    <div className="bottom-0 sticky flex justify-center gap-4 bg-background py-2">
                        <Button
                            variant="genericRounded"
                            onClick={addPosts}>
                            Add posts
                        </Button>
                        <Button
                            variant="genericRounded"
                            onClick={() => setSelectedPosts([])}>
                            Clear
                        </Button>
                    </div>}
            </div>
        </div>
    );
}
