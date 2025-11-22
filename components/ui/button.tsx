import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        genericRounded:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full cursor-pointer",
        savePin:
          "absolute top-[1rem] right-[.5rem] dark:[background-color:rgba(14,159,40,0.43)]   disabled:bg-secondary disabled:text-secondary-foreground shadow-lg hover:bg-primary/90 rounded-full cursor-pointer disabled:opacity-100",
        pinUsername:
          "absolute bottom-[.5rem] right-[.5rem] bg-primary text-primary-foreground rounded-[0.8rem] cursor-pointer p-0",
        icon:
          "rounded-full hover:bg-accent active:scale-85 cursor-pointer",
        iconSmall:
          "rounded-full hover:bg-accent active:scale-85 cursor-pointer size-4 ",
        destructiveIcon:
          "disabled:opacity-50 rounded-full hover:bg-destructive/30 active:scale-85 cursor-pointer",
        link:
          "text-primary underline-offset-4 hover:underline",
        followButton:
          "font-normal font-sans text-primary text-sm decoration-1 hover:underline underline-offset-4 cursor-pointer",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        username: "px-2.5 py-1",
        icon: "size-9",
        wrap: "w-fit h-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
