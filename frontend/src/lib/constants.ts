import type { Tone } from "./search/types"
import type {
  EpisodeOutcome,
  LiveStatus,
  ModuleFormat,
  NavItems,
  RunStatus,
} from "./types"

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

export const COVER_CLASS: Record<string, string> = {
  "3": "bg-nominal/60",
  "2": "bg-nominal/30",
  "1": "bg-warn/45",
  "0": "bg-alarm/50",
}

export const TONE = {
  text: {
    nominal: "text-nominal-fg",
    warn: "text-warn-fg",
    alarm: "text-alarm-fg",
    live: "text-live-fg",
    model: "text-model",
    neutral: "text-text-dim",
  },
  pill: {
    nominal: "bg-nominal/15 text-nominal-fg",
    warn: "bg-warn/15 text-warn-fg",
    alarm: "bg-alarm/15 text-alarm-fg",
    live: "bg-live/12 text-live-fg",
    model: "bg-model/15 text-model",
    neutral: "bg-secondary text-text-dim",
  },
  dot: {
    nominal: "bg-nominal",
    warn: "bg-warn",
    alarm: "bg-alarm",
    live: "bg-live",
    model: "bg-model",
    neutral: "bg-line-strong",
  },
} satisfies Record<string, Record<Tone, string>>

export const OUTCOME_TONE: Record<EpisodeOutcome, Tone> = {
  success: "nominal",
  marginal: "warn",
  fail: "alarm",
  sim_fault: "neutral",
}
export const STATUS_TONE: Record<RunStatus, Tone> = {
  queued: "neutral",
  running: "live",
  complete: "nominal",
  failed: "alarm",
  cancelled: "neutral",
}

/** Threshold level: 0 nominal · 1 deviating · 2 over limit */
export const LEVEL_TONE = [
  "neutral",
  "warn",
  "alarm",
] as const satisfies readonly Tone[]

export const LEVEL_LABEL = ["nominal", "deviating", "over limit"] as const
export const LEVEL_CHIP = ["bg-line-strong", "bg-warn", "bg-alarm"]

/** Identity colour for runs, campaigns and episodes. */
export const RUN_COLOURS = [1, 2, 3, 4, 5, 6].map((n) => `bg-run-${n}`)

export const PATH_SEGMENT: Partial<Record<ModuleFormat, string>> = {
  mission: "m",
  campaign: "c",
  run: "r",
  episode: "e",
}
