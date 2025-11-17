"use client";

import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// If using Next.js Image:
import Image from "next/image";
const MotionImage = motion(Image);

const f1 = [
    "https://i.pinimg.com/736x/99/8e/1f/998e1fe357d9251b83dcd4322114a137.jpg",
    "https://i.pinimg.com/1200x/f7/5a/3e/f75a3ead04915bf42882892094276cde.jpg",
]

const f2 = [
    "https://i.pinimg.com/736x/18/a4/bb/18a4bb162ef5ca9a3bb3f8fb80b5c49b.jpg",
    "https://i.pinimg.com/736x/f9/2a/6a/f92a6a91ea98fc9b2f090e18b8dfffc0.jpg",

]

const f3 = [
    "https://i.pinimg.com/1200x/79/06/50/790650747b0afb64a79ae833a5c826d1.jpg",
    "https://i.pinimg.com/736x/0e/3e/d4/0e3ed430f722b2d84c2b9607af18cc58.jpg",
]

const f4 = [
    "https://i.pinimg.com/736x/21/44/28/214428e7d638f0232f1a2f5b49d8243e.jpg",
    "https://i.pinimg.com/736x/81/0f/9a/810f9ab05d6843f8688a7923f946c44c.jpg",

]

const data = [
    {
        path: "movie-aesthetic",
        title: "Movie aesthetics",
        sections: ["All images", "photography", "still-shots", "movie-clips", "movie-scenes"]

    },
    {
        path: "art-sketches",
        title: "Art Sketches",
        sections: ["All images", "anatomy", "fabric-textures", "poses"]
    },
]

const LongGridItem = ({
    images,
    index,
    direction
}: {
    images: string[],
    index: number,
    direction: 1 | -1
}) => {

    return (
        <div className="relative rounded-2xl w-[200px] h-[325px] overflow-hidden">
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                <MotionImage
                    key={index}
                    src={images[index]}
                    alt=""
                    fill
                    sizes="500px"
                    priority
                    className="grayscale-[0.2] object-cover"
                    initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 75, damping: 20 }}
                />
            </AnimatePresence>
        </div>
    )

}

const MediumGridItem = ({
    images,
    index,
    direction
}: {
    images: string[],
    index: number,
    direction: 1 | -1
}) => {

    return (
        <div className="relative rounded-2xl w-[200px] h-[250px] overflow-hidden">
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                <MotionImage
                    key={index}
                    src={images[index]}
                    alt=""
                    fill
                    sizes="500px"
                    priority
                    className="grayscale-[0.2] object-cover"
                    initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 75, damping: 20 }}
                />
            </AnimatePresence>
        </div>
    )

}

const ShortGridItem = ({
    images,
    index,
    direction
}: {
    images: string[],
    index: number,
    direction: 1 | -1
}) => {

    return (
        <div className="relative rounded-2xl w-[200px] h-[100px] overflow-hidden">
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                <MotionImage
                    key={index}
                    src={images[index]}
                    alt=""
                    fill
                    sizes="500px"
                    priority
                    className="grayscale-[0.2] object-cover"
                    initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 75, damping: 20 }}
                />
            </AnimatePresence>
        </div>
    )

}

const AnimatedTitle = ({ titles, index }: { titles: string[], index: number }) => {

    return (
        <motion.h1
            key={index}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "200%", opacity: 0, }}
            transition={{ type: "spring", stiffness: 75, damping: 20 }}
            className="font-semibold text-3xl">
            {titles[index]}
        </motion.h1>
    )

}

const AnimatedPathSpan = ({ paths, index }: { paths: string[], index: number }) => {
    return (
        <motion.span
            key={index}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 75, damping: 20 }}>
            {paths[index]}
        </motion.span>
    )
}

const AnimatedSectionsSpan = ({ sections, index }: { sections: string, index: number }) => {
    return (
        <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-medium text-muted-foreground text-sm">
            {sections}
        </motion.span>
    )
}
export default function AuthComponent() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);

    const IMAGES_LENGTH = 2;

    const paginate = (dir: 1 | -1) => {
        setDirection(dir);
        setIndex((i) => (i + dir + IMAGES_LENGTH) % IMAGES_LENGTH);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            paginate(1);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return <></>


    return (
        <div className="space-y-4">

            {/* <div className="flex flex-col justify-center items-center gap-2">
                <motion.span
                    key={index}
                    initial={{ y: direction < 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: direction < 0 ? "-100%" : "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 75, damping: 20 }}
                    className="font-bold text-sm text-center">
                    {folderData[index].path}
                </motion.span>
                <span>{folderData[index].title}</span>
                <span>{folderData[index].description}</span>
                <div className="space-x-2">
                    <span>{folderData[index].images} images</span>
                    <span>{folderData[index].saves} saves</span>
                    <span>{folderData[index].likes} likes</span>
                </div>
                <span>Created {folderData[index].createdAt.toLocaleDateString()} days ago</span>
            </div> */}

            {/* Fixed area for the slide */}

            <div className="bg-[#111111] mx-auto px-8 pt-8 border border-white/20 w-[1500px] h-[1000px] font-sans text-primary">
                <div className="flex flex-row justify-start items-center gap-1 text-sm">
                    <span>Michael</span> <ChevronRight className="w-4 h-4" /> <AnimatedPathSpan paths={data.map(item => item.path)} index={index} />
                </div>
                <AnimatedTitle titles={data.map(item => item.title)} index={index} />
                <h2 className="text-muted-foreground text-sm">Movie Description</h2>
                <div className="flex flex-row justify-start items-center gap-2 cursor-pointer">
                    {data[index].sections.map((section, idx) => (
                        <AnimatedSectionsSpan key={idx} sections={section} index={index} />
                    ))}
                </div>
                <div className="flex flex-row justify-center items-start gap-8 mt-8">
                    <div className="flex flex-col justify-center items-center gap-8">
                        <LongGridItem images={f1} index={index} direction={direction} />
                        <MediumGridItem images={f2} index={index} direction={(-direction as 1 | -1)} />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-8">

                        <ShortGridItem images={f3} index={index} direction={direction} />
                        <LongGridItem images={f4} index={index} direction={(-direction as 1 | -1)} />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-8">
                        <LongGridItem images={f1} index={index} direction={direction} />
                        <MediumGridItem images={f2} index={index} direction={(-direction as 1 | -1)} />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-8">
                        <ShortGridItem images={f3} index={index} direction={direction} />
                        <LongGridItem images={f4} index={index} direction={(-direction as 1 | -1)} />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-8">
                        <LongGridItem images={f1} index={index} direction={direction} />
                        <MediumGridItem images={f2} index={index} direction={(-direction as 1 | -1)} />
                    </div>
                </div>
            </div>

            {/* <div className="flex justify-center items-center gap-8">
                <div className="relative rounded-4xl w-[200px] h-[325px] overflow-hidden">
                    <AnimatePresence initial={false} mode="sync" custom={direction}>
                        <MotionImage
                            key={index}
                            src={images[index]}
                            alt=""
                            fill
                            sizes="500px"
                            priority
                            className="object-cover"
                            initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 75, damping: 20 }}
                        />
                    </AnimatePresence>
                </div>

                <div className="relative rounded-4xl w-[200px] h-[325px] overflow-hidden">
                    <AnimatePresence initial={false} mode="sync" custom={direction}>
                        <MotionImage
                            key={index}
                            src={images2[index]}
                            alt=""
                            fill
                            sizes="500px"
                            priority
                            className="object-cover"
                            initial={{ y: direction < 0 ? "100%" : "-100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: direction < 0 ? "-100%" : "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 75, damping: 20 }}
                        />
                    </AnimatePresence>
                </div>
            </div> */}
        </div >
    );
}
