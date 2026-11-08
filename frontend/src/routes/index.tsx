import { ListTableRowLink } from "@/components/ListTableRowLink"
import RecentLinks from "@/components/RecentLinks"
import { RowSectionActionLink } from "@/components/RowSectionActionLink"
import {
  TileLink,
  TileLinkWithBadge,
  TileLinkWithCoverage,
} from "@/components/TileLink"
import { Badge } from "@/components/ui/badge"
import { MISSIONS } from "@/lib/data/core"
import {
  ATTENTION,
  OUTCOME,
  PINNED,
  RECENT,
  RECENTS,
  RUNNING,
  SYSTEM,
} from "@/lib/data/home"
import type {
  AttentionData,
  MissionsData,
  PinnedData,
  RecentLink,
  RecentRunsData,
  SystemStatusData,
  TileGridRowData,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { LineGraph } from "@velora/components/charts"
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
import { SearchBar } from "@velora/components/search"

export const Route = createFileRoute("/")({
  component: HomePage,
})

const HeroSearch = ({ recents }: { recents: RecentLink[] }) => {
  return (
    <div className="flex flex-col items-center gap-3.5 py-2">
      {/* Title */}
      <div className="font-mono text-xs tracking-wider text-mute uppercase">
        Velora Analytics
      </div>
      <SearchBar
        size="lg"
        className="w-full max-w-180"
        placeholder="Search missions, campaigns, runs, channels..."
      />
      <RecentLinks caption="Recent" recentItems={recents} />
    </div>
  )
}

const RunningNowGrid = ({ data }: { data: TileGridRowData[] }) => {
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

const AttentionListTable = ({ data }: { data: AttentionData[] }) => {
  return (
    <ListTable columns={2} sizes={{ 0: "fill" }}>
      {data.map((a) => (
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
  )
}

const PinnedGridStack = ({ data }: { data: PinnedData[] }) => {
  return (
    <TileGrid layout="stack">
      {data.map((d) =>
        d.coverage ? (
          <TileLinkWithCoverage key={d.id} to="/campaigns" {...d}>
            {d.metadata && (
              <>
                {d.metadata.description}{" "}
                <span className="text-alarm-fg">
                  {d.metadata.requirementsNotMet} requirements not met
                </span>
              </>
            )}
          </TileLinkWithCoverage>
        ) : (
          <TileLinkWithBadge key={d.id} to="/playback" {...d} />
        )
      )}
    </TileGrid>
  )
}

const RecentRunsListTable = ({ data }: { data: RecentRunsData[] }) => {
  return (
    <ListTable
      columns={7}
      sizes={{
        0: "icon",
        2: "fill",
        4: "minmax(64px,auto)",
        5: "minmax(64px,auto)",
      }}
    >
      {data.map((r) => (
        <ListTableRowLink key={r.id} to="/playback">
          <ListTableCell
            align="center"
            className={cn("size-2.25 rounded-xs", r.chip)}
          />
          <ListTableCell className="text-12.5 font-mono">{r.id}</ListTableCell>
          <ListTableCell className="truncate text-dim">{r.name}</ListTableCell>
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
  )
}

const MissionsGrid = ({ data }: { data: MissionsData[] }) => {
  return (
    <TileGrid>
      {data.map((m) => (
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
          <span className="text-xs text-muted-foreground">{m.tagline}</span>
          <span className="mt-1 font-mono text-xs text-mute">{m.stats}</span>
        </TileLink>
      ))}
    </TileGrid>
  )
}

const SystemStatusRow = ({ data }: { data: SystemStatusData[] }) => {
  return (
    <Callout className="gap-x-5.5 border-line bg-transparent text-xs text-muted-foreground">
      {data.map((s) => (
        <div key={s.text} className="inline-flex items-center gap-1.75">
          <span className={cn("size-1.5 rounded-full", s.dot)} />
          {s.text}
        </div>
      ))}
    </Callout>
  )
}

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
            <RunningNowGrid data={RUNNING} />
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
            <AttentionListTable data={ATTENTION} />
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
            <PinnedGridStack data={PINNED} />
          </RowSectionContent>
        </RowSection>

        <RowSection size="wide">
          <RowSectionHeader>
            <RowSectionTitle>Recent runs</RowSectionTitle>
            <RowSectionActionLink to="/playback">All runs</RowSectionActionLink>
          </RowSectionHeader>
          <RowSectionContent>
            <RecentRunsListTable data={RECENT} />
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
            <MissionsGrid data={MISSIONS} />
          </RowSectionContent>
        </RowSection>
      </RowLayout>

      {/* Row 4: System status */}
      <RowLayout>
        <RowSection>
          <RowSectionContent>
            <SystemStatusRow data={SYSTEM} />
          </RowSectionContent>
        </RowSection>
      </RowLayout>
    </PageLayout>
  )
}
