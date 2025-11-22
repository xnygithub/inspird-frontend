"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, VariantProps } from "class-variance-authority"


const tabsListVariants = cva(
  "inline-flex justify-center items-center",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground h-9 w-fit rounded-lg p-[3px]",
        profile: "text-muted-foreground w-fit gap-2 relative w-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  cn(
    "dark:data-[state=inactive]:hover:brightness-150 dark:data-[state=active]:text-foreground dark:text-muted-foreground", // Dark Mode Styles
    "data-[state=inactive]:hover:brightness-50 data-[state=active]:text-black text-muted-foreground", // Light Mode Styles
    "inline-flex h-[calc(100%-1px)] data-[state=inactive]:hover:cursor-pointer",
    "px-2.5 py-1 whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ),
  {
    variants: {
      variant: {
        default:
          "text-lg font-medium",
        profile:
          "select-none font-sans ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      forceMount={true}
      className={cn("data-[state=inactive]:hidden flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
