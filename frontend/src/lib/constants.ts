import type { CommandGroupResult, NavItems, Status } from "./types"

export const NAV_ITEMS: NavItems[] = [
  { label: "Live", to: "/live", live: true },
  { label: "Dashboards", to: "/dashboards" },
  { label: "Telemetry", to: "/telemetry" },
  { label: "Playback", to: "/playback" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Monitoring", to: "/monitoring" },
  { label: "Configs", to: "/configs" },
]

export const COMMAND_MENU_FILTER_NAMES: string[] = [
  "all",
  "missions",
  "campaigns",
  "agents",
  "environments",
  "episodes",
  "channels",
]

// COLOURS
export const STATUS_CLASS: Record<Status, string> = {
  success: "text-nominal-fg bg-nominal/15",
  complete: "text-nominal-fg bg-nominal/15",
  marginal: "text-warn-fg bg-warn/15",
  fail: "text-alarm-fg bg-alarm/15",
  running: "text-live-fg bg-live/15",
  active: "text-live-fg bg-live/15",
}

export const RESULT_ITEM_COLOURS: string[] = [
  "var(--color-run-1)",
  "var(--color-run-2)",
  "var(--color-run-3)",
  "var(--color-run-4)",
  "var(--color-run-5)",
  "var(--color-run-6)",
]

// TODO: replace with API
export const COMMAND_GROUP_DATA: CommandGroupResult[] = [
  {
    id: "running",
    heading: "RUNNING NOW",
    items: [
      // find(CAMPAIGNS, "MC-032"),
      // find(CAMPAIGNS, "CA-08"),
      // find(RUNS, "CA-0419"),
    ],
  },
  {
    id: "pinned",
    heading: "PINNED",
    items: [
      // find(CAMPAIGNS, "MC-031"),
      // find(RUNS, "CA-0419"),
      // find(RUNS, "CA-0421"),
    ],
  },
  {
    id: "recent",
    heading: "RECENT",
    items: [],
    // RUNS.slice(2, 7)
  },
]
