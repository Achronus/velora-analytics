import HeroSearch from "@/components/HeroSearch"
import { ListTableRowLink } from "@/components/ListTableRowLink"
import { RowSectionActionLink } from "@/components/RowSectionActionLink"
import { TileGridRowAsPanels } from "@/components/TileGridRow"
import {
  TileLink,
  TileLinkWithBadge,
  TileLinkWithCoverage,
} from "@/components/TileLink"
import { Badge } from "@/components/ui/badge"
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
import {
  Callout,
  ListTable,
  ListTableCell,
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
            <TileGridRowAsPanels data={RUNNING} />
          </RowSectionContent>
        </RowSection>

        <RowSection size="narrow">
          <RowSectionHeader>
            <RowSectionTitle>Needs attention</RowSectionTitle>
            <RowSectionActionLink to="/monitoring">
              Monitoring
            </RowSectionActionLink>
          </RowSectionHeader>
          <RowSectionContent>
            <ListTable columns={2} sizes={{ 0: "fill" }}>
              {ATTENTION.map((a) => (
                <ListTableRowLink
                  key={a.title}
                  to="/monitoring"
                  tone={a.level === "alarm" ? "alarm" : "warn"}
                  className="items-start"
                >
                  <ListTableCell>
                    <span className="block">{a.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {a.sub}
                    </span>
                  </ListTableCell>
                  <ListTableCell
                    align="end"
                    className={cn(
                      "text-[11px] whitespace-nowrap",
                      a.level === "alarm" ? "text-alarm-fg" : "text-warn-fg"
                    )}
                  >
                    {a.tag}
                  </ListTableCell>
                </ListTableRowLink>
              ))}
            </ListTable>
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
          <RowSectionContent>
            <TileGrid layout="stack">
              <TileLinkWithCoverage
                to="/campaigns"
                coverage={COVERAGE}
                id="MC-031"
                tagline="CA-07 vs cam_classic · nominal sweep"
              >
                2,000 runs · 77.8% success ·{" "}
                <span className="text-alarm-fg">2 requirements not met</span>
              </TileLinkWithCoverage>

              {PINNED.map((r) => (
                <TileLinkWithBadge
                  key={r.id}
                  to="/playback"
                  chip={r.chip}
                  id={r.id}
                  tagline={r.name}
                  outcome={r.outcome}
                />
              ))}
            </TileGrid>
          </RowSectionContent>
        </RowSection>

        <RowSection size="wide">
          <RowSectionHeader>
            <RowSectionTitle>Recent runs</RowSectionTitle>
            <RowSectionActionLink to="/playback">All runs</RowSectionActionLink>
          </RowSectionHeader>
          <RowSectionContent>
            <ListTable
              columns={7}
              sizes={{
                0: "icon",
                2: "fill",
                4: "minmax(64px,auto)",
                5: "minmax(64px,auto)",
              }}
            >
              {RECENT.map((r) => (
                <ListTableRowLink key={r.id} to="/playback">
                  <ListTableCell
                    align="center"
                    className={cn("size-2.25 rounded-xs", r.chip)}
                  />
                  <ListTableCell className="text-12.5 font-mono">
                    {r.id}
                  </ListTableCell>
                  <ListTableCell className="truncate text-dim">
                    {r.name}
                  </ListTableCell>
                  <ListTableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded px-1.75 py-0.5 text-[11px]",
                        OUTCOME[r.outcome].bgColour,
                        OUTCOME[r.outcome].textColour
                      )}
                    >
                      {r.outcome}
                    </Badge>
                  </ListTableCell>
                  <ListTableCell
                    className={cn(
                      "text-right font-mono text-xs",
                      OUTCOME[r.outcome].textColour
                    )}
                  >
                    {r.miss}
                  </ListTableCell>
                  <ListTableCell className="font-mono text-xs text-mute">
                    {r.campaign}
                  </ListTableCell>
                  <ListTableCell className="text-right text-xs text-mute">
                    {r.when}
                  </ListTableCell>
                </ListTableRowLink>
              ))}
            </ListTable>
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
