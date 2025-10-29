"use client";
import { Button } from "@/components/ui/button";
import type { ProfilePostsType as Posts } from "@/types/posts";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry"
import { useInView } from "react-intersection-observer";
import { useOffsetInfiniteScrollQuery, useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getPosts } from "@/lib/queries/posts";
import { getFoldersSimpleQuery } from "@/lib/queries/folders";
import { getMediaUrl } from "@/utils/urls";

export default function Copy() {
    const supabase = createClient();
    const id = "f4bfd097-7b65-491f-9a9c-71e2f71c05c0"
    const [folders, setFolders] = useState<string>("");
    const [selected, setSelected] = useState<Posts[]>([]);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(() => getPosts(supabase, id),
            { pageSize: 15 }
        );

    useEffect(() => {
        if (inView && loadMore) loadMore()
    }, [inView, loadMore])

    const items = data ?? [];

    const { data: foldersData } = useQuery(
        getFoldersSimpleQuery(supabase, id)
    );

    function selectImage(image: Posts) {
        if (selected.includes(image)) {
            setSelected(selected.filter((p) => p !== image));
        } else {
            setSelected([...selected, image]);
        }
    }

    if (items.length === 0 && !isValidating && !loadMore) {
        return <div className="mt-10 text-center">No posts found</div>
    }

    return (
        <div className="flex flex-row gap-2 w-full h-full overflow-y-hidden font-sans">
            <div className="flex flex-col w-[12.5%]">
                <span className="py-1 text-lg text-center">Your libraries</span>
                <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-1">
                        <span className="opacity-80 font-medium">Common</span>
                        <div className="bg-border w-full h-[1px]"></div>
                        <div className="flex flex-col gap-0.5 text-sm">
                            <span>Explore</span>
                            <span>Your saved</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="opacity-80 font-medium">Folders</span>
                        <div className="bg-border w-full h-[1px]"></div>
                        <div className="flex flex-col gap-0.5 overflow-y-auto text-sm no-scrollbar">
                            {foldersData?.map((folder, index) => (
                                <div key={index} onClick={() => setFolders(folder.name)}>{folder.name}</div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white w-[1px] h-full"></div>
            <div className="flex flex-col w-[67.5%]">
                <span className="py-1 text-lg text-center">Selected images from your library: {folders}</span>
                <div className="mt-2 p-2 overflow-y-auto no-scrollbar">
                    <Masonry columnsCount={5} gutter="10px" >
                        {items.map((image) => (
                            <div
                                key={image.id}
                                className={`relative w-full cursor-pointer
                                ${selected.includes(image) ? 'outline-4 outline-blue-500' : ''}`}
                                onClick={() => selectImage(image)}
                            >
                                <Image
                                    key={image.id}
                                    src={getMediaUrl(image.mediaUrl)}
                                    alt={image.mediaAltText || ''}
                                    width={image.mediaWidth}
                                    height={image.mediaHeight}
                                    className="object-cover"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </Masonry>
                    {!isValidating && loadMore && <div ref={ref} className="h-[1px]"></div>}
                </div>
            </div>
            <div className="bg-white w-[1px] h-full"></div>
            <div className="flex flex-col w-[20%]">
                <span className="py-1 text-lg text-center">Selected Images ({selected.length})</span>
                <div className="mt-2 px-0.5 h-full overflow-y-auto no-scrollbar">
                    <Masonry columnsCount={2} gutter="10px" >
                        {selected.map((image) => (
                            <Image
                                key={image.id}
                                src={getMediaUrl(image.mediaUrl)}
                                alt="Random Image"
                                width={image.mediaWidth}
                                height={image.mediaHeight}
                                onClick={() => selectImage(image)}
                                className="object-cover cursor-pointer"
                            />
                        ))}
                    </Masonry>
                </div>
                <div className="space-x-2 pt-3 pb-0.5 w-full text-center">
                    <Button variant="genericRounded">Add</Button>
                    <Button variant="genericRounded" onClick={() => setSelected([])}>Clear</Button>
                </div>
            </div>
        </div>
    );
}
