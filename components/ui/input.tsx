import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex bg-transparent shadow-xs px-3 py-1 border border-input aria-invalid:border-destructive rounded-md outline-none w-full min-w-0 h-9 text-base transition-[color,box-shadow] disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "file:inline-flex selection:bg-primary dark:bg-input/30 file:bg-transparent disabled:opacity-50  file:border-0 focus-visible:border-ring aria-invalid:ring-destructive/20 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40  file:h-7 file:font-medium selection:text-primary-foreground placeholder:text-muted-foreground file:text-foreground md:text-sm file:text-sm ",
        search: "text-sm rounded-full border-0 bg-accent h-12 px-4 font-medium text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
function Input({ className, type, variant, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input }
