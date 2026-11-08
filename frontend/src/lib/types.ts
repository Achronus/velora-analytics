import type {
  SwatchType,
  Crumb,
  ID,
  ISODate,
  ModuleFormat,
  Param,
  Pill,
  SearchHit,
  Tone,
} from "@velora/components"
import type { FC } from "react"

export type RecentLink = {
  id: string
  chip: string
  to: string
}

export type Status =
  "success" | "marginal" | "fail" | "running" | "complete" | "active"

export type RunStatus =
  "queued" | "running" | "complete" | "failed" | "cancelled"

export type EpisodeOutcome = "success" | "marginal" | "fail" | "sim_fault"

export type CheckpointRef = { runId: ID; step: number }

export type Line = { points: string; className: string; dash?: boolean }

export type NavItems = {
  label: string
  to: string
  live?: boolean
}

export type RowDisplay = {
  title: string
  mono?: boolean
  name?: string
  sub: string
  chip?: SwatchType
  pill?: Pill
}

/* -------- Hierarchy -------- */

export type Mission = {
  id: ID
  name: string
  description?: string
  channels: ChannelDef[]
  requirements: Requirement[]
}

export type Campaigns = {
  id: ID
  missionId: ID
  name: string
  description?: string
  createdAt: ISODate
}

type RunBase = {
  id: ID
  campaignID: ID
  name: string
  status: RunStatus
  numEnvs: number
  episodeCount: number
  configId: ID // preset launched from
  startedAt?: ISODate
  endedAt?: ISODate
}

export type TrainRun = RunBase & {
  type: "train"
  algorithm: string
  totalSteps: number
  stepsDone: number
  checkpoints: { step: number; promoted?: boolean }[]
}

export type EvalRun = RunBase & {
  type: "eval"
  policy: CheckpointRef // What's being evaluated
  sweep: Record<string, { min: number; max: number } | Param[]>
}

export type Run = TrainRun | EvalRun

/* -------- Episode -------- */

export type Episode = {
  id: ID
  runId: ID
  index: number
  status: "running" | "done"
  outcome?: EpisodeOutcome
  env: EnvInfo
  agents: AgentInfo[]
  startedAt: ISODate
  duration?: number
  recording: "full" | "summary" // summary = re-simulate from seed
  summary: Record<string, number>
}

export type EnvInfo = {
  index: number // E.g., #17
  seed: number
  params: Record<string, Param>
}

export type AgentInfo = {
  id: ID // "PPO-001", "MC-032"
  policy: CheckpointRef
  deterministic: boolean
}

export type EpisodeEvent = {
  t: number
  kind: string
  agentId?: ID
  channel?: string
  message?: string
}

export type ChannelDef = {
  name: string
  source: "env" | "agent" | "reward"
  dtype: "float" | "int" | "bool" | "enum"
  unit?: string
  desc?: string
  perAgent?: boolean // recorded once per agent in multi-agent episodes
  threshold?: { warn: number; limit: number; direction: "above" | "below" }
  model?: { name: string; validated: boolean }
}

export type Requirement = {
  id: ID
  desc: string
  metric: string // summary key, e.g., "minBoomMargin"
  op: ">=" | "<="
  value: number
  rate: number
}

export type RequirementResult = { id: string; met: boolean; observed: number }

/* -------- Search -------- */

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

export type SearchGroup = { key: string; heading: string; hits: SearchHit[] }

export type SearchResponse = {
  groups: SearchGroup[]
  counts: Partial<Record<ModuleFormat, number>>
}

export type HrefContext = {
  scope: Crumb[]
  plotted?: string[]
}

export type ModuleSpec<M extends ModuleFormat> = {
  label: string
  limit: number
  row: (hit: SearchHit<M>) => RowDisplay
  href: (hit: SearchHit<M>, ctx: HrefContext) => string
  Preview: FC<{ hit: SearchHit<M> }>
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

export type BadgeColour = {
  bgColour: string
  textColour: string
}

/* -------- API Data Types -------- */

export type GraphData = {
  pct: number
  line: number[]
  lineClass?: string
  warn?: number
  danger?: number
  inverted?: boolean
}

export type TileGridRowData = {
  id: string
  kind: string
  chip: string
  name: string
  sub: string
  graph?: GraphData
}

export type AttentionData = {
  title: string
  sub: string
  tag: string
  level: "alarm" | "warn"
}

export type PinnedData = {
  id: string
  chip: string
  tagline: string
  outcome?: EpisodeOutcome
  coverage?: string
  metadata?: {
    description: string
    requirementsNotMet: number
  }
}

export type RecentRunsData = {
  id: string
  chip: string
  name: string
  outcome: EpisodeOutcome
  miss: string
  campaign: string
  when: string
}

export type MissionsData = {
  id: string
  name: string
  tagline: string
  tag: string
  active: boolean
  stats: string
  vehicles: string
  description?: string
  dashboardCount: number
}

export type SystemStatusData = {
  dot: string
  text: string
}
