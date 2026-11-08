import { COVER_CLASS } from "@/lib/constants"
import { OUTCOME } from "@/lib/data/home"
import type { EpisodeOutcome } from "@/lib/types"
import { cn } from "@/lib/utils"
import { createLink } from "@tanstack/react-router"
import { TileAnchor } from "@velora/components/layout"
import { Badge } from "./ui/badge"

export const TileLink = createLink(TileAnchor)

type TileLinkWithCoverageProps = {
  id: string
  to: string
  chip: string
  tagline: string
  coverage?: string
  children?: React.ReactNode
}

export const TileLinkWithCoverage = ({
  id,
  to,
  chip,
  tagline,
  coverage,
  children,
}: TileLinkWithCoverageProps) => {
  return (
    <TileLink to={to} className="flex-row items-center gap-3.5 px-3.5 py-3">
      <div
        className="grid shrink-0 grid-cols-[repeat(10,7px)] gap-[1.5px]"
        aria-hidden
      >
        {coverage &&
          coverage
            .split("")
            .map((c, i) => (
              <span
                key={i}
                className={cn("size-1.75 rounded-[1px]", COVER_CLASS[c])}
              />
            ))}
      </div>
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 font-mono text-sm">
          <span className={cn("size-2.25 rounded-xs", chip)} />
          {id}
        </div>
        <span className="mt-0.75 block text-[13px] text-text">{tagline}</span>
        {children && (
          <div className="mt-0.5 block text-xs text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    </TileLink>
  )
}

type TileLinkWithBadgeProps = {
  id: string
  to: string
  chip: string
  tagline: string
  outcome?: EpisodeOutcome
}

export const TileLinkWithBadge = ({
  id,
  to,
  chip,
  tagline,
  outcome,
}: TileLinkWithBadgeProps) => {
  return (
    <TileLink
      to={to}
      className="flex-row items-center justify-between gap-2.5 px-3.5 py-3"
    >
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 font-mono text-sm">
          <span className={cn("size-2.25 rounded-xs", chip)} />
          {id}
        </div>
        <span className="mt-0.75 block truncate text-xs text-muted-foreground">
          {tagline}
        </span>
      </div>
      {outcome && (
        <Badge
          variant="secondary"
          className={cn(
            "rounded px-1.75 py-0.5 text-[11px]",
            OUTCOME[outcome].bgColour,
            OUTCOME[outcome].textColour
          )}
        >
          {outcome}
        </Badge>
      )}
    </TileLink>
  )
}
