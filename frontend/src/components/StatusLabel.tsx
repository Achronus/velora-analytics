import { TONE_DOT, TONE_TEXT } from "@/lib/constants"
import { cn, type Tone } from "@velora/components"
import type { ComponentProps } from "react"

export const StatusLabel = ({
  tone,
  className,
  children,
  ...props
}: ComponentProps<"span"> & { tone: Tone }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        TONE_TEXT[tone] ?? "text-mute",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          TONE_DOT[tone] ?? "bg-line-strong"
        )}
      />
      {children}
    </span>
  )
}
