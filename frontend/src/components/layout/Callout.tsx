import { cn } from "@/lib/utils"
import { createLink } from "@tanstack/react-router"
import { cva, type VariantProps } from "class-variance-authority"
import { createContext, useContext, type ComponentProps } from "react"

type CalloutTone = "live" | "warn" | "alarm" | "neutral"

const CalloutContext = createContext<CalloutTone>("neutral")

const calloutVariants = cva(
  "flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[10px] border px-4 py-3 text-[13px]",
  {
    variants: {
      tone: {
        live: "border-live/35 bg-live/7",
        warn: "border-l-3 border-warn/40 border-l-warn bg-warn/6",
        alarm: "border-l-3 border-alarm/40 border-l-alarm bg-alarm/6",
        neutral: "border-border bg-panel",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
)

const TITLE_TONE = {
  live: "text-live-fg",
  warn: "text-warn-fg",
  alarm: "text-alarm-fg",
  neutral: "text-text",
} as const

const Callout = ({
  className,
  tone,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof calloutVariants>) => {
  return (
    <CalloutContext value={tone ?? "neutral"}>
      <div
        data-slot="callout"
        className={cn(calloutVariants({ tone }), className)}
        {...props}
      />
    </CalloutContext>
  )
}

const CalloutAnchor = ({
  className,
  tone,
  ...props
}: ComponentProps<"a"> & VariantProps<typeof calloutVariants>) => {
  return (
    <CalloutContext value={tone ?? "neutral"}>
      <a
        data-slot="callout"
        className={cn(calloutVariants({ tone }), className)}
        {...props}
      />
    </CalloutContext>
  )
}

const CalloutLink = createLink(CalloutAnchor)

const CalloutTitle = ({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & { tone?: CalloutTone }) => {
  const inherited = useContext(CalloutContext)

  return (
    <span
      data-slot="callout-title"
      className={cn(
        "inline-flex items-center gap-2 font-semibold",
        TITLE_TONE[tone ?? inherited],
        className
      )}
      {...props}
    />
  )
}

const CalloutDescription = ({
  className,
  ...props
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="callout-description"
      className={cn("min-w-0 text-dim", className)}
      {...props}
    />
  )
}

export {
  Callout,
  CalloutDescription,
  CalloutLink,
  CalloutTitle,
  calloutVariants,
  type CalloutTone,
}
