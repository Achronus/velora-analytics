import { CalloutAction, CalloutLink } from "@/components/CalloutLink"
import MultiLineGraph from "@/components/charts/MultiLineGraph"
import {
  PageSidebar,
  PageSidebarGroup,
  PageSidebarHeading,
  PageSidebarItemCount,
  PageSidebarItemLabel,
  PageSidebarItemMeta,
} from "@/components/PageSidebar"
import { PageSidebarItem } from "@/components/PageSidebarItem"
import { StatusLabel } from "@/components/StatusLabel"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MISSIONS } from "@/lib/data/core"
import { DASHBOARDS, FILTERS, VIEWS } from "@/lib/data/dashboard"
import type { DashboardData, MissionsData, ViewsFilter } from "@/lib/types"
import { cn } from "@/lib/utils"
import { createFileRoute, Link } from "@tanstack/react-router"
import { LiveDot } from "@velora/components"
import {
  CalloutDescription,
  CalloutTitle,
  PageHeader,
  PageHeaderActions,
  PageHeaderMeta,
  PageHeaderTitle,
  PageLayout,
  RowLayout,
  RowSection,
  Tile,
  TileGrid,
} from "@velora/components/layout"
import { ArrowRight, Search, Star } from "lucide-react"
import { useState } from "react"

type DashboardsSearch = { mission?: string; view?: string }

export const Route = createFileRoute("/dashboards/")({
  validateSearch: (search: Record<string, unknown>): DashboardsSearch => ({
    mission: typeof search.mission === "string" ? search.mission : undefined,
    view: typeof search.view === "string" ? search.view : undefined,
  }),
  component: RouteComponent,
})

const DashboardSidebar = ({
  missions,
  views,
}: {
  missions: MissionsData[]
  views: ViewsFilter[]
}) => {
  return (
    <PageSidebar>
      <PageSidebarGroup>
        <PageSidebarHeading>Missions</PageSidebarHeading>
        {missions.map((m) => (
          <PageSidebarItem
            key={m.tag}
            to="/dashboards"
            search={(prev) => ({ ...prev, mission: m.tag })}
            indicator
          >
            <PageSidebarItemLabel>{m.name}</PageSidebarItemLabel>
            <PageSidebarItemMeta className="font-mono">
              {m.vehicles} · {m.dashboardCount}
            </PageSidebarItemMeta>
          </PageSidebarItem>
        ))}
      </PageSidebarGroup>

      <PageSidebarGroup>
        <PageSidebarHeading>Views</PageSidebarHeading>
        {views.map((v) => (
          <PageSidebarItem
            key={v.id}
            to="/dashboards"
            search={(prev) => ({ ...prev, view: v.id })}
          >
            <PageSidebarItemLabel>{v.label}</PageSidebarItemLabel>
            <PageSidebarItemCount>{v.count}</PageSidebarItemCount>
          </PageSidebarItem>
        ))}
      </PageSidebarGroup>
    </PageSidebar>
  )
}

const DashboardPageHeader = ({
  mission,
  lastCampaignLink,
  newRunLink,
}: {
  mission: MissionsData
  lastCampaignLink: string
  newRunLink: string
}) => {
  return (
    <PageHeader>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-mono text-xs text-mute">{mission.vehicles}</span>
        <PageHeaderTitle className="font-sans text-2xl font-semibold tracking-[-0.01em]">
          {mission.name}
        </PageHeaderTitle>
        <PageHeaderMeta className="text-[13px]">
          {mission.description}
        </PageHeaderMeta>
      </div>
      <PageHeaderActions>
        <Link
          to={lastCampaignLink}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9.5 px-3.5 font-normal"
          )}
        >
          Latest campaign
        </Link>
        <Link
          to={newRunLink}
          className={cn(buttonVariants(), "h-9.5 px-3.5 font-semibold")}
        >
          New run
        </Link>
      </PageHeaderActions>
    </PageHeader>
  )
}

const PageCallout = ({
  id,
  to,
  actionText,
  children,
}: {
  id: string
  to: string
  actionText: string
  children: React.ReactNode
}) => {
  return (
    <RowLayout>
      <RowSection>
        <CalloutLink to={to} tone="live">
          <CalloutTitle>
            <LiveDot status="running" />
            RUNNING
          </CalloutTitle>
          <span className="font-mono">{id}</span>
          <CalloutDescription>{children}</CalloutDescription>
          <CalloutAction>
            {actionText} <ArrowRight className="size-3.5" aria-hidden />
          </CalloutAction>
        </CalloutLink>
      </RowSection>
    </RowLayout>
  )
}

const PageSearchBar = ({ filters }: { filters: string[] }) => {
  return (
    <RowLayout>
      <RowSection className="min-w-0 flex-[999_1_320px]" size="fill">
        <InputGroup className="h-9.5 bg-panel">
          <InputGroupAddon>
            <Search aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search dashboards"
            aria-label="Search dashboards"
          />
        </InputGroup>
      </RowSection>
      <RowSection className="max-w-full flex-[0_1_auto]" size="auto">
        <ToggleGroup
          defaultValue={[filters[0]]}
          aria-label="Dashboard type"
          spacing={0}
          className="flex-wrap gap-2.5 rounded-lg border border-line p-0.75"
        >
          {filters.map((o) => (
            <ToggleGroupItem
              key={o}
              value={o}
              className="h-auto min-w-0 cursor-pointer rounded-md border-0 px-3 py-1.5 text-[13px] font-normal text-muted-foreground hover:bg-transparent hover:text-text aria-pressed:bg-raised aria-pressed:text-text"
            >
              {o}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </RowSection>
    </RowLayout>
  )
}

const ItemTile = ({
  name,
  lines,
  run,
  type,
  status,
  updated,
  pinned,
}: DashboardData) => {
  return (
    <Tile className="gap-0 overflow-hidden rounded-xl p-0">
      <Link to="/live">
        <MultiLineGraph
          lines={lines}
          className="h-23 border-b border-border bg-viewport"
        />
        <div className="block px-3.5 pt-3 pb-1">
          <span className="block text-[15px] font-semibold">{name}</span>
          <span className="mt-0.75 block font-mono text-xs text-mute">
            {run}
          </span>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 px-3.5 pt-1.5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded bg-raised text-[11px] font-medium text-dim"
          >
            {type}
          </Badge>
          <StatusLabel tone={status.tone}>{status.label}</StatusLabel>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-mute">{updated}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${pinned ? "Unpin" : "Pin"} ${name}`}
          >
            <Star
              className={cn(
                "size-4",
                pinned ? "fill-text text-text" : "text-mute"
              )}
              aria-hidden
            />
          </Button>
        </div>
      </div>
    </Tile>
  )
}

function RouteComponent() {
  const [mission, setMission] = useState(MISSIONS[0])

  return (
    <PageLayout>
      <DashboardSidebar missions={MISSIONS} views={VIEWS} />
      <DashboardPageHeader
        mission={mission}
        lastCampaignLink="/campaigns/results"
        newRunLink="/configs"
      />
      <PageCallout id="MC-032" to="/live" actionText="Watch a live episode">
        Campaign · CA-08 candidate · episode 383 / 2,000 · 64 envs · ~1.5h left
      </PageCallout>
      <PageSearchBar filters={FILTERS} />

      <RowLayout>
        <RowSection>
          <TileGrid className="grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3.5">
            {DASHBOARDS.map((d) => (
              <ItemTile key={d.name} {...d} />
            ))}
          </TileGrid>
        </RowSection>
      </RowLayout>
    </PageLayout>
  )
}
