import { ROW_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

const rowStackVariants = cva("flex min-w-0 flex-col gap-3.5", {
  variants: { size: ROW_SIZE },
  defaultVariants: { size: "narrow" },
})

const RowStack = ({
  className,
  size,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof rowStackVariants>) => {
  return (
    <div
      data-slot="row-stack"
      className={cn(rowStackVariants({ size }), className)}
      {...props}
    />
  )
}

export { RowStack, rowStackVariants }
