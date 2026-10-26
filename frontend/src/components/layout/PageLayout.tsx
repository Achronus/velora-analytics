import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const pageLayoutVariants = cva(
  [
    "relative flex min-w-0 flex-col gap-4 [--page-sidebar-w:15rem]",
    "lg:with-sidebar:min-h-[calc(100svh-3.25rem)] lg:with-sidebar:pl-[calc(var(--page-sidebar-w)+1.5rem)]",
  ],
  {
    variants: {
      width: {
        full: "px-6 pt-4.5 pb-7",
        contained: "mx-auto w-full max-w-7xl gap-5 px-8 pt-9 pb-8",
      },
    },
    defaultVariants: { width: "full" },
  }
)

const PageLayout = ({
  className,
  width,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof pageLayoutVariants>) => {
  return (
    <div
      data-slot="page-layout"
      className={cn(pageLayoutVariants({ width }), className)}
      {...props}
    />
  )
}

export { PageLayout, pageLayoutVariants }
