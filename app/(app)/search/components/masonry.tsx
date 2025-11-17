"use client"
import dynamic from "next/dynamic";
import { MasonryItem } from "@/components/posts/masonry-item";

const Masonry = dynamic(() => import('masonic').then(m => m.Masonry), { ssr: false });

export default function MasonryComponent(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { data }: { data: any }
) {
    return (
        <>
            <Masonry
                items={data}
                rowGutter={15}
                columnGutter={15}
                columnWidth={200}
                render={MasonryItem}
            />
        </>
    )
}
