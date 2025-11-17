import Image from 'next/image'
import type Konva from 'konva'
import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react'
import { zoomToNode } from "../features/functions/zoom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import { useStore } from '../features/store';
import { GroupContent, GroupWrapper, ImageNode } from '../features/types';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Search, TrashIcon, EyeOff, Eye, Pencil } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import GroupEditor from './groupEditor';
import { GroupEditPopover } from './groupEditor';

const ImageItem = ({ image }: { image: ImageNode }) => {
    const isZooming = useRef<boolean>(false);
    const [title, setTitle] = useState<string>(image.getAttr('_title') || "Image");
    const [hidden, setHidden] = useState<boolean>(false);

    const isGrouped = image.isGrouped();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        image.setAttr('_title', e.target.value);
    }

    const zoom = () => {
        if (isZooming.current) return;
        isZooming.current = true;
        zoomToNode(image);
        setTimeout(() => {
            isZooming.current = false;
        }, 1000);
    }

    const toggleHidden = () => {
        setHidden(!hidden);
        if (hidden) {
            image.show();
        } else {
            image.hide();
        }
    }

    return (
        <li className="group flex items-center gap-2 bg-white/10 p-2 rounded-xl cursor-pointer">
            <div className="relative w-10 h-10 aspect-square">
                <Image
                    fill
                    sizes="20px"
                    src={image.getAttr('src')}
                    alt={image.getAttr('src')}
                    onDoubleClick={zoom}
                    className="rounded-xl object-contain" />
            </div>
            <div className="flex items-center">
                <Input
                    type="text"
                    variant="layer"
                    value={title}
                    onChange={onChange}
                />
                {isGrouped &&
                    <Button variant="icon" onClick={image.removeFromGroup}
                        className="opacity-0 group-hover:opacity-100">
                        <ArrowLeftRight size={8} />
                    </Button>}
                <Button variant="icon" onClick={toggleHidden}
                    className={cn(
                        "opacity-0 group-hover:opacity-100",
                        hidden ? "opacity-100" : "opacity-0")}>
                    {!hidden ? <Eye size={8} /> : <EyeOff size={8} />}
                </Button>
                <Button variant="icon" onClick={image.destroyImage}
                    className="opacity-0 group-hover:opacity-100">
                    <TrashIcon size={8} />
                </Button>
            </div>
        </li>
    )
}
const Images = ({
    images
}: {
    images: ImageNode[]
}) => {
    const [q, setQ] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);


    if (q) {
        images = images.filter((image) => {
            const title = image.getAttr('_title') || "";
            return title.toLowerCase().includes(q.toLowerCase());
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
                <span className="opacity-70 font-medium">Images</span>
                <Button variant="icon" onClick={() => setOpen(!open)}>
                    <Search />
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {open && (
                    <Input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                )}
                <ul className="flex flex-col gap-2">
                    {images.map((image) => (
                        <ImageItem key={image.id()} image={image} />
                    ))}
                </ul>
            </div>
        </div>
    )
}


const GroupImages = ({
    images,
    group
}: {
    images: ImageNode[]
    group: GroupWrapper
}) => {
    const [q, setQ] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);


    if (q) {
        images = images.filter((image) => {
            const title = image.getAttr('_title') || "";
            return title.toLowerCase().includes(q.toLowerCase());
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-end items-center gap-2">
                <EditPopover group={group} />
                <Button variant="icon" onClick={() => setOpen(!open)}>
                    <Search />
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {open && (
                    <Input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                )}
                <ul className="flex flex-col gap-2">
                    {images.map((image) => (
                        <ImageItem key={image.id()} image={image} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

const EditPopover = ({ group }: { group: GroupWrapper }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="icon">
                    <Pencil />
                </Button>
            </PopoverTrigger>
            <PopoverContent side='left' align='start' sideOffset={160}>
                <GroupEditPopover group={group} />
            </PopoverContent>
        </Popover>
    )
}

const Groups = ({ groups }: { groups: GroupWrapper[] }) => {
    return (
        <div>
            <span className="block opacity-70 mb-2 font-medium">Groups</span>
            <ul >
                {groups.map((group) => {
                    const contentNode = group.findOne<GroupContent>('.group-content');
                    const titleNode = group.findOne<Konva.Text>('.group-title');
                    if (!contentNode || !titleNode) return null;
                    const images = contentNode.find<ImageNode>('.group-image-node');
                    return (
                        <Accordion type="single" collapsible key={contentNode.id()}>
                            <AccordionItem value="item-1" >
                                <AccordionTrigger className="py-2 cursor-pointer">{titleNode.text()}</AccordionTrigger>
                                <AccordionContent>
                                    <GroupImages images={images} group={group} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                })}
            </ul>
        </div >
    )
}

const LayerView = () => {
    const initialized = useStore((s) => s.initialized);
    const nodes = useStore((s) => s.nodes);
    const images = nodes.filter((node) => node.name() === 'image-node') as ImageNode[];
    const groups = useStore((s) => s.groups);

    if (initialized === false) return null;

    return (
        <div className={cn(
            "right-0 bottom-0 z-10 absolute",
            "bg-[#1A1A1A] px-3 py-5 w-72 h-[calc(100%-var(--nav-height))]",
            "font-sans flex flex-col gap-6 text-sm",
            "border-l border-white/30")}>
            <Images images={images} />
            <Groups groups={groups} />
            <GroupEditor />
        </div>
    )
}

export default LayerView