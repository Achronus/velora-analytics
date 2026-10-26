import { STAT_VALUE_TONE } from "@/lib/constants"
import type { StatTone } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

const StatStrip = ({ className, ...props }: ComponentProps<"dl">) => {
  return (
    <dl
      data-slot="stat-strip"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden rounded-[10px] border border-border bg-border",
        className
      )}
      {...props}
    />
  )
}

const Stat = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="stat"
      className={cn("bg-bg px-3.5 py-3", className)}
      {...props}
    />
  )
}

const StatLabel = ({ className, ...props }: ComponentProps<"dt">) => {
  return (
    <dt
      data-slot="stat-label"
      className={cn("text-xs text-mute", className)}
      {...props}
    />
  )
}

const StatValue = ({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"dd"> & { tone?: StatTone }) => {
  return (
    <dd
      data-slot="stat-value"
      className={cn(
        "mt-0.75 font-mono text-xl",
        STAT_VALUE_TONE[tone],
        className
      )}
      {...props}
    />
  )
}

const StatHint = ({ className, ...props }: ComponentProps<"dd">) => {
  return (
    <dd
      data-slot="stat-hint"
      className={cn("mt-0.5 text-[11.5px] text-mute", className)}
      {...props}
    />
  )
}

export { Stat, StatHint, StatLabel, StatStrip, StatValue }
