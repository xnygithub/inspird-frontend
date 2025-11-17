'use client'
import { cn } from "@/lib/utils";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function KenBurnsSlideshow({
    images = [
        {
            src: "https://i.pinimg.com/1200x/e5/19/72/e519729f8dadebafdc8e504f6d5f605a.jpg",
            alt: "Image 1",
            credit: "Yoneyama Mai @ Pinterest",
        },
        {
            src: "https://i.pinimg.com/1200x/98/10/bf/9810bf2097b33c1d3d90db4298e76f44.jpg",
            alt: "Image 2",
            credit: "Yoneyama @ Pinterest",
        },
        {
            src: "https://i.pinimg.com/1200x/8a/8a/3f/8a8a3f28c1aff19c34786a3b6bd4fbe3.jpg",
            alt: "Image 3",
            credit: " Mai @ Pinterest",
        },
    ],
    slideDuration = 8000,
    fadeDuration = 1200,
    className = "hidden lg:block relative  w-full h-[420px] lg:h-[560px] overflow-hidden rounded-2xl",
}: {
    images?: { src: string; alt?: string; credit?: string }[];
    slideDuration?: number;
    fadeDuration?: number;
    className?: string;
}) {
    const [index, setIndex] = React.useState(0);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        // Start slideshow after mount (helps avoid SSR hydration mismatches)
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (!isMounted || images.length <= 1) return;

        const id = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);

            // Reset index to 0 after last image
            if (index === images.length - 1) {
                setIndex(0);
            }
        }, slideDuration);

        return () => clearInterval(id);
    }, [images.length, slideDuration, isMounted, index]);

    const current = images[index];

    return (
        <div className={className}>
            {/* Image layer */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={current.src + index}
                    src={current.src}
                    alt={current.alt ?? "Slideshow image"}
                    className="absolute inset-0 dark:brightness-[0.5] dark:grayscale w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: fadeDuration / 1000, ease: "easeOut" },
                        scale: { duration: (slideDuration - fadeDuration) / 1000, ease: "easeOut" },
                    }}
                />
                {current.credit ? (
                    <motion.span className={cn("right-4 bottom-2 absolute font-sans cursor-pointer",
                        "font-semibold text-muted-foreground text-xs underline underline-offset-4 ",
                        "hover:text-white transition-all duration-200 ")}
                        key={`credit-${index}`} // forces unmount/mount per slide
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 1, ease: "easeIn" } }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: fadeDuration / 1000, ease: "easeOut" }
                        }}>
                        {current.credit}
                    </motion.span>
                ) : null}
            </AnimatePresence>
        </div >
    );
}
