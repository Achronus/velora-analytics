import type {
  RunStatus,
  CheckpointRef,
  EpisodeOutcome,
  ISODate,
  ID,
  ModuleFormat,
} from "@/lib/types"
import type { FC } from "react"

// Per-module search payload

export type SearchHitData = {
  mission: {
    description?: string
    campaigns: number
    episodes: number
    state: "active" | "spec"
  }
  campaign: {
    description?: string
    runs: number
    running: number
  }
  run:
    | {
        type: "train"
        status: RunStatus
        algorithm: string
        stepsDone: number
        totalSteps: number
        successRate?: number
      }
    | {
        type: "eval"
        status: RunStatus
        policy: CheckpointRef
        episodesDone: number
        episodeCount: number
        successRate?: number
        requirements?: { met: number; total: number }
      }
  agent: {
    checkpoint: CheckpointRef
    algorithm: string
    promoted?: boolean
    evaluatedIn: number
  }
  environment: {
    description?: string
    randomised: number
    episodes: number
  }
  episode: {
    status: "running" | "done"
    outcome?: EpisodeOutcome
    envIndex: number
    headline?: string
    startedAt: ISODate
  }
  channel: {
    desc?: string
    unit?: string
    source: "env" | "agent" | "reward"
    level?: 0 | 1 | 2
    validated?: boolean
    latestEpisode?: Crumb[]
  }
}

export type Crumb = { module: ModuleFormat; id: ID; name: string }

type HitBase = {
  id: ID
  name: string
  path: Crumb[]
}

export type SearchHit = {
  [M in ModuleFormat]: HitBase & { module: M; data: SearchHitData[M] }
}[ModuleFormat]

export type HitOf<M extends ModuleFormat> = HitBase & {
  module: M
  data: SearchHitData[M]
}

export type SearchGroup = { key: string; heading: string; hits: SearchHit[] }

export type SearchResponse = {
  groups: SearchGroup[]
  counts: Partial<Record<ModuleFormat, number>>
}

export type HrefContext = {
  scope: Crumb[]
  plotted?: string[]
}

export type Tone = "nominal" | "warn" | "alarm" | "live" | "model" | "neutral"

export type RowDisplay = {
  title: string
  mono?: boolean
  name?: string
  sub: string
  chip?: { className: string; shape: "square" | "dot" | "outline" }
  pill?: { label: string; tone: Tone }
}

export type ModuleSpec<M extends ModuleFormat> = {
  label: string
  limit: number
  row: (hit: HitOf<M>) => RowDisplay
  href: (hit: HitOf<M>, ctx: HrefContext) => string
  Preview: FC<{ hit: HitOf<M> }>
}

export type PreviewData = {
  facts: { k: string; v: string; tone?: Tone }[]
  note?: string
  series?: {
    label: string
    value: string
    values: number[]
    warn?: number
    limit?: number
    inverted?: boolean
  }
  coverage?: number[]
  actions?: { label: string; href: string; key?: string }[]
}
