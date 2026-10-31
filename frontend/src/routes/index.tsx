import HeroSearch from "@/components/HeroSearch"
import { RowSectionActionLink } from "@/components/RowSectionActionLink"
import { TileLink } from "@/components/TileLink"
import { Badge } from "@/components/ui/badge"
import { RECENTS, RUNNING } from "@/lib/data/home"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { LineGraph } from "@velora/components/charts"
import {
  PageLayout,
  RowLayout,
  RowSection,
  RowSectionAction,
  RowSectionContent,
  RowSectionHeader,
  RowSectionTitle,
  TileGrid,
} from "@velora/components/layout"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <PageLayout width="contained">
      <HeroSearch recents={RECENTS} />

      {/* Row 1 */}
      <RowLayout>
        <RowSection size="wide">
          <RowSectionHeader>
            <RowSectionTitle>
              <span className="size-1.75 rounded-full bg-live motion-safe:animate-live" />
              Running now
            </RowSectionTitle>
            <RowSectionAction>sim pool 128 envs · 112 in use</RowSectionAction>
          </RowSectionHeader>
          <RowSectionContent>
            <TileGrid>
              {RUNNING.map((r) => (
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
                  <div className="text-[13px] text-text">{r.name}</div>
                  <LineGraph
                    width={240}
                    height={40}
                    points={r.line}
                    progress={r.pct}
                    warn_limit={r.warn}
                    danger_limit={r.danger}
                    inverted={r.inverted}
                    lineClassName={r.lineClass}
                    className="h-10"
                  />
                  <span className="text-xs text-muted-foreground">{r.sub}</span>
                </TileLink>
              ))}
            </TileGrid>
          </RowSectionContent>
        </RowSection>

        <RowSection size="narrow">
          <RowSectionHeader>
            <RowSectionTitle>Needs attention</RowSectionTitle>
            <RowSectionActionLink to="/monitoring">
              Monitoring
            </RowSectionActionLink>
          </RowSectionHeader>
        </RowSection>
      </RowLayout>
    </PageLayout>
  )
}
