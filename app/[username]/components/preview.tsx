import Image from "next/image";
import defaultImage from "@/public/gray.png";
import Link from "next/link";
import { FolderCardType } from "@/app/[username]/types";
import { timeAgo } from "@/utils/timeAgo";


export default function FolderCard({ folder }: { folder: FolderCardType }) {
    return (
        <Link href={`/${folder.ownerUsername}/${folder.slug}`}>
            <div className="flex flex-col gap-1">
                <div className="relative w-full aspect-square">
                    <div className="absolute inset-0">
                        <Image
                            src={(folder.thumbnails && folder.thumbnails[0]) || defaultImage}
                            alt="Image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 256px"
                            priority={false}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="font-semibold text-[14px]">{folder.name}</p>
                    <div className="flex flex-row justify-between">
                        <p className="font-semibold text-[12px] text-gray-500">
                            {folder.postCount} {folder.postCount === 1 ? "Post" : "Posts"}
                        </p>
                        <p className="font-semibold text-[12px] text-gray-500">
                            {timeAgo(folder.lastUpdated)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
