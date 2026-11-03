import type { TileGridRowData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { LineGraph } from "@velora/components/charts"
import { TileGrid } from "@velora/components/layout"
import { TileLink } from "./TileLink"
import { Badge } from "./ui/badge"

const TileGridRowAsPanels = ({ data }: { data: TileGridRowData[] }) => {
  return (
    <TileGrid>
      {data.map((r) => (
        <TileLink key={r.id} to="/live">
          {/* Title */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className={cn("size-2.25 rounded-xs", r.chip)} />
              {r.id}
            </div>
            <Badge
              variant="secondary"
              className="rounded px-1.75 py-px text-[11px] font-normal text-dim"
            >
              {r.kind}
            </Badge>
          </div>

          {/* Content */}
          {r.graph && (
            <>
              <div className="text-[13px] text-text">{r.name}</div>
              <LineGraph
                width={240}
                height={40}
                points={r.graph.line}
                progress={r.graph.pct}
                warn_limit={r.graph.warn}
                danger_limit={r.graph.danger}
                inverted={r.graph.inverted}
                lineClassName={r.graph.lineClass}
                className="h-10"
              />
            </>
          )}

          <span className="text-xs text-muted-foreground">{r.sub}</span>
        </TileLink>
      ))}
    </TileGrid>
  )
}

export { TileGridRowAsPanels }
