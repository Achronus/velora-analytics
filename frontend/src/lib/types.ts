import type { Preview } from "@/features/CommandSearch/types"

export type ModuleFormat =
  | "mission"
  | "campaign"
  | "run"
  | "agent"
  | "environment"
  | "episode"
  | "channel"

export type Status =
  "success" | "marginal" | "fail" | "running" | "complete" | "active"

export type NavItems = {
  label: string
  to: string
  live?: boolean
}

type ID = string
type ISODate = string
type Param = number | string | boolean

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

type RunStatus = "queued" | "running" | "complete" | "failed" | "cancelled"

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

export type CheckpointRef = { runId: ID; step: number }

/* -------- Episode -------- */

export type Episode = {
  id: ID
  runId: ID
  index: number
  status: "running" | "done"
  outcome?: "success" | "marginal" | "fail" | "sim_fault"
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

export type SearchItemOwner = {
  mission: string
  campaign?: string
  agent?: string
  environment?: string
  episode?: string
}

export type SearchItem = {
  module: ModuleFormat
  id: ID // Unique identifier such as "CA-0419", "MC-031"
  name: string // Name of the item
  desc: string // Secondary line with additional details
  href: string
  colour?: string
  status?: Status
  owner: SearchItemOwner
  preview: Preview
}

export type CommandGroupResult = {
  id: string
  heading: string
  items: SearchItem[]
}
