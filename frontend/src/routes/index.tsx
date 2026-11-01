import HeroSearch from "@/components/HeroSearch"
import { RowSectionActionLink } from "@/components/RowSectionActionLink"
import { TileLink } from "@/components/TileLink"
import { Badge } from "@/components/ui/badge"
import { COVER_CLASS } from "@/lib/constants"
import {
  ATTENTION,
  COVERAGE,
  MISSIONS,
  OUTCOME,
  PINNED,
  RECENT,
  RECENTS,
  RUNNING,
  SYSTEM,
} from "@/lib/data/home"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { LineGraph } from "@velora/components/charts"
import {
  Callout,
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
          <RowSectionContent className="rounded-lg border">
            {ATTENTION.map((a) => (
              <TileLink
                key={a.title}
                to="/monitoring"
                variant="list"
                className="grid grid-cols-[3px_minmax(0,1fr)] gap-3 border-x-0 border-y-0 py-2.75 pr-3.5 not-last:rounded-b-none not-last:border-b hover:bg-panel"
              >
                <span
                  className={a.level === "alarm" ? "bg-alarm" : "bg-warn"}
                />
                <div className="border-none">
                  <div className="flex justify-between gap-2 text-[13px]">
                    {a.title}
                    <span
                      className={cn(
                        "text-[11px] whitespace-nowrap",
                        a.level === "alarm" ? "text-alarm-fg" : "text-warn-fg"
                      )}
                    >
                      {a.tag}
                    </span>
                  </div>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {a.sub}
                  </span>
                </div>
              </TileLink>
            ))}
          </RowSectionContent>
        </RowSection>
      </RowLayout>

      {/* Row 2 */}
      <RowLayout>
        <RowSection size="narrow">
          <RowSectionHeader>
            <RowSectionTitle>Pinned</RowSectionTitle>
            <RowSectionAction>pin from search or any run</RowSectionAction>
          </RowSectionHeader>
          <RowSectionContent className="flex flex-col gap-2.5">
            <TileGrid layout="stack">
              <TileLink
                to="/campaigns"
                className="flex-row items-center gap-3.5 px-3.5 py-3"
              >
                <div
                  className="grid shrink-0 grid-cols-[repeat(10,7px)] gap-[1.5px]"
                  aria-hidden
                >
                  {COVERAGE.split("").map((c, i) => (
                    <span
                      key={i}
                      className={cn("size-1.75 rounded-[1px]", COVER_CLASS[c])}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 font-mono text-sm">
                    <span className="size-2.25 rounded-xs bg-run-1" />
                    MC-031
                  </div>
                  <span className="mt-0.75 block text-[13px] text-text">
                    CA-07 vs cam_classic · nominal sweep
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    2,000 runs · 77.8% success ·{" "}
                    <span className="text-alarm-fg">
                      2 requirements not met
                    </span>
                  </span>
                </div>
              </TileLink>
              {PINNED.map((r) => (
                <TileLink
                  key={r.id}
                  to="/playback"
                  className="flex-row items-center justify-between gap-2.5 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 font-mono text-sm">
                      <span className={cn("size-2.25 rounded-xs", r.chip)} />
                      {r.id}
                    </div>
                    <span className="mt-0.75 block truncate text-xs text-muted-foreground">
                      {r.name}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded px-1.75 py-0.5 text-[11px]",
                      OUTCOME[r.outcome].pill
                    )}
                  >
                    {r.outcome}
                  </Badge>
                </TileLink>
              ))}
            </TileGrid>
          </RowSectionContent>
        </RowSection>

        <RowSection size="wide">
          <RowSectionHeader>
            <RowSectionTitle>Recent runs</RowSectionTitle>
            <RowSectionActionLink to="/playback">All runs</RowSectionActionLink>
          </RowSectionHeader>
          <RowSectionContent className="rounded-lg border">
            {RECENT.map((r) => (
              <TileLink
                key={r.id}
                to="/playback"
                variant="list"
                className="grid min-h-10 grid-cols-[14px_84px_minmax(0,1fr)_80px_64px_64px_88px] items-center gap-2.5 border-x-0 border-y-0 px-3.5 text-[13px] not-last:rounded-b-none not-last:border-b hover:bg-panel"
              >
                <span className={cn("size-2.25 rounded-xs", r.chip)} />
                <span className="text-12.5 font-mono">{r.id}</span>
                <span className="truncate text-dim">{r.name}</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded px-1.75 py-0.5 text-[11px]",
                    OUTCOME[r.outcome].pill
                  )}
                >
                  {r.outcome}
                </Badge>
                <span
                  className={cn(
                    "text-right font-mono text-xs",
                    OUTCOME[r.outcome].text
                  )}
                >
                  {r.miss}
                </span>
                <span className="font-mono text-xs text-mute">
                  {r.campaign}
                </span>
                <span className="text-right text-xs text-mute">{r.when}</span>
              </TileLink>
            ))}
          </RowSectionContent>
        </RowSection>
      </RowLayout>

      {/* Row 3 */}
      <RowLayout>
        <RowSection>
          <RowSectionHeader>
            <RowSectionTitle>Missions</RowSectionTitle>
            <RowSectionActionLink to="/configs">New run</RowSectionActionLink>
          </RowSectionHeader>
          <RowSectionContent>
            <TileGrid>
              {MISSIONS.map((m) => (
                <TileLink
                  key={m.name}
                  variant="ghost"
                  to="/campaigns"
                  className={m.active ? undefined : "opacity-75"}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{m.name}</span>
                    <span
                      className={cn(
                        "text-[11px]",
                        m.active ? "text-live-fg" : "text-mute"
                      )}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {m.desc}
                  </span>
                  <span className="mt-1 font-mono text-xs text-mute">
                    {m.stats}
                  </span>
                </TileLink>
              ))}
            </TileGrid>
          </RowSectionContent>
        </RowSection>
      </RowLayout>

      {/* Row 4: System status */}
      <RowLayout>
        <RowSection>
          <RowSectionContent>
            <Callout className="gap-x-5.5 border-line bg-transparent text-xs text-muted-foreground">
              {SYSTEM.map((s) => (
                <div key={s.text} className="inline-flex items-center gap-1.75">
                  <span className={cn("size-1.5 rounded-full", s.dot)} />
                  {s.text}
                </div>
              ))}
            </Callout>
          </RowSectionContent>
        </RowSection>
      </RowLayout>
    </PageLayout>
  )
}
