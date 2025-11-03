"use client";
import Image from "next/image";
import { getMediaUrl } from "@/utils/urls";
import { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry"
import { getPosts } from "@/lib/queries/posts";
import { Button } from "@/components/ui/button";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useInView } from "react-intersection-observer";
import { getFoldersSimpleQuery } from "@/lib/queries/folders";
import type { ProfilePostsType as Posts } from "@/types/posts";
import { useOffsetInfiniteScrollQuery, useQuery } from "@supabase-cache-helpers/postgrest-swr";

const getFolderPosts = (client: SupabaseClient, f_id: string) => {
    return client.rpc('get_folder_posts', { f_id });
}


type FolderPath = {
    id: string;
    name: string;
    isPrivate: boolean;
    updatedAt: string;
    slug: string;
}

export const AddImagesView = ({
    addPost
}: {
    addPost: (post: Posts) => void;
}) => {
    const supabase = createClient();
    const id = "f4bfd097-7b65-491f-9a9c-71e2f71c05c0"
    const [folderPath, setFolderPath] = useState<FolderPath | null>(null);
    const [selected, setSelected] = useState<Posts[]>([]);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, loadMore, isValidating } =
        useOffsetInfiniteScrollQuery(
            () => folderPath ?
                getFolderPosts(supabase, folderPath.id) :
                getPosts(supabase, id), { pageSize: 15, revalidateFirstPage: false });

    useEffect(() => {
        if (inView && !isValidating && loadMore)
            setTimeout(() => {
                loadMore();
            }, 100);
    }, [inView, loadMore, isValidating])

    const items = data ?? [];

    const { data: foldersData } = useQuery<FolderPath[]>(
        getFoldersSimpleQuery(supabase, id)
    );

    function selectImage(image: Posts) {
        if (selected.includes(image)) {
            setSelected(selected.filter((p) => p !== image));
        } else {
            setSelected([...selected, image]);
        }
    }

    function addImages() {
        selected.forEach((image) => {
            addPost(image);
        });
    }

    function clearSelected() {
        setSelected([]);
    }



    return (
        <div className="flex flex-row gap-2 w-full h-full overflow-y-hidden font-sans">
            <div className="flex flex-col w-[12.5%]">
                <span className="py-1 text-lg text-center">Your libraries</span>
                <div className="flex flex-col gap-5 mt-2 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="opacity-80 font-medium">Common</span>
                        <div className="bg-border w-full h-[1px]"></div>
                        <span className="hover:bg-accent p-2 cursor-pointer" onClick={() => setFolderPath(null)}>Your saved</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="opacity-80 font-medium">Folders</span>
                        <div className="bg-border w-full h-[1px]"></div>
                        <div className="flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
                            {foldersData?.map((folder, index) => (
                                <div
                                    key={index}
                                    className="hover:bg-accent p-2 cursor-pointer"
                                    onClick={() => setFolderPath(folder)}>
                                    {folder.name}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-border w-[1px] h-full"></div>
            <div className="flex flex-col w-[67.5%]">
                <span className="py-1 text-lg text-center">Selected images from your library: {folderPath?.name || "All Posts"}</span>
                <div className="mt-2 p-1 overflow-y-auto no-scrollbar">
                    {items.length === 0 && !isValidating && !loadMore &&
                        <div className="mt-10 text-center">No posts found</div>}
                    <Masonry columnsCount={5} gutter="10px" >
                        {items.map((image) => (
                            <div
                                key={image.id}
                                className="relative w-full cursor-pointer"
                                onClick={() => selectImage(image)}>
                                <Image
                                    key={image.id}
                                    src={getMediaUrl(image.mediaUrl)}
                                    alt={image.mediaAltText || ''}
                                    width={image.mediaWidth}
                                    height={image.mediaHeight}
                                    className={`${selected.includes(image) ? 'opacity-30' : ''} object-cover`}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div >
                        ))}
                    </Masonry>
                    {!isValidating && loadMore && <div ref={ref} className="h-[1px]"></div>}
                </div>
            </div >
            <div className="bg-border w-[1px] h-full"></div>
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
                    <Button variant="genericRounded" onClick={() => addImages()}>Add</Button>
                    <Button variant="genericRounded" onClick={() => clearSelected()}>Clear</Button>
                </div>
            </div>
        </div >
    );
}
