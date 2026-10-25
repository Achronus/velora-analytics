import type { LiveStatus, NavItems } from "./types"

export const NAV_ITEMS: NavItems[] = [
  { label: "Dashboards", to: "/dashboards" },
  { label: "Telemetry", to: "/telemetry" },
  { label: "Live", to: "/live", live: true },
  { label: "Playback", to: "/playback" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Monitoring", to: "/monitoring" },
  { label: "Configs", to: "/configs" },
]

export const DOT: Record<LiveStatus, string> = {
  running: "bg-live-on motion-safe:animate-live",
  idle: "bg-text-mute",
  offline: "bg-live-off",
}
