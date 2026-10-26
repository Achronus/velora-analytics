import { cn } from "@/lib/utils"
import { type ComponentProps } from "react"

const RowLayout = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="row-layout"
      className={cn("flex flex-wrap items-start gap-4", className)}
      {...props}
    />
  )
}

export { RowLayout }
