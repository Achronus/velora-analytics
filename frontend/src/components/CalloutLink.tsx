import { cn } from "@/lib/utils"
import { createLink } from "@tanstack/react-router"
import { CalloutAnchor } from "@velora/components/layout"
import type { ComponentProps } from "react"

export const CalloutLink = createLink(CalloutAnchor)

export const CalloutAction = ({
  className,
  ...props
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="callout-action"
      className={cn(
        "ml-auto inline-flex items-center gap-1 text-nominal-fg",
        className
      )}
      {...props}
    />
  )
}
