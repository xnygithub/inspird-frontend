import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import Link from "next/link"


const variants = cva(
    "inline-flex justify-center items-center px-4 py-2 rounded-md h-fit text-center whitespace-nowrap transition-all duration-200", {
    variants: {
        variant: {
            default:
                "bg-primary text-primary-foreground hover:bg-primary/90",
            outline:
                "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        },

    },
    defaultVariants: {
        variant: "default",
    },
}
)

const CustomLink = ({
    className,
    variant,
    href,
    text
}: {
    className?: string
    variant?: VariantProps<typeof variants>["variant"]
    href: string
    text: string
}) => {
    return (
        <Link href={href} className={cn(variants({ variant, className }))}>
            {text}
        </Link>
    );
};



export { CustomLink, variants }
