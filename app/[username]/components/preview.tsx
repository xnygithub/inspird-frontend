import Image from "next/image";
import defaultImage from "@/public/gray.png";
import Link from "next/link";
import { FolderCardType } from "../types";



const ImageWrapper = ({ image }: { image?: string }) => (
    <div className="absolute inset-0">
        <Image
            src={image || defaultImage}
            alt="Image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
            priority={false}
        />
    </div>
);

interface FolderCardProps {
    folder: FolderCardType
}
export default function FolderCard({ folder }: FolderCardProps) {
    console.log(folder)

    return (
        <div className="flex flex-col gap-2">
            <Link href={`/${folder.owner.username}/${folder.slug}`}>
                <div className="relative rounded-md w-full aspect-square overflow-hidden">
                    {folder.thumbnail ?
                        <ImageWrapper image={folder.thumbnail} />
                        :
                        <ImageWrapper image={undefined} />
                    }
                </div>
            </Link>
            <p>{folder.name}</p>
        </div>
    );
}
