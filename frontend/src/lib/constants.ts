import type { NavItems } from "./types"

export const NAV_ITEMS: NavItems[] = [
  { label: "Live", to: "/live", live: true },
  { label: "Dashboards", to: "/dashboards" },
  { label: "Telemetry", to: "/telemetry" },
  { label: "Playback", to: "/playback" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Monitoring", to: "/monitoring" },
  { label: "Configs", to: "/configs" },
]
