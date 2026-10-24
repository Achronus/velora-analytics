import type { ModuleFormat, RunStatus, EpisodeOutcome } from "@/lib/types"
import type { Tone } from "./types"

export const PATH_SEGMENT: Partial<Record<ModuleFormat, string>> = {
  mission: "m",
  campaign: "c",
  run: "r",
  episode: "e",
}

export const STATUS_TONE: Record<RunStatus, Tone> = {
  queued: "neutral",
  running: "live",
  complete: "nominal",
  failed: "alarm",
  cancelled: "neutral",
}

export const OUTCOME_TONE: Record<EpisodeOutcome, Tone> = {
  success: "nominal",
  marginal: "warn",
  fail: "alarm",
  sim_fault: "neutral",
}

export const LEVEL_TONE = ["neutral", "warn", "alarm"] as const
export const LEVEL_CHIP = ["bg-line-strong", "bg-warn", "bg-alarm"]
export const RUN_COLOURS = [1, 2, 3, 4, 5, 6].map((n) => `bg-run-${n}`)
