import type { EpisodeOutcome } from "../types"

export const RECENTS = [
  { id: "CA-0419", chip: "bg-run-1", to: "/playback" },
  { id: "MC-031", chip: "bg-run-1", to: "/playback" },
  { id: "CA-0421", chip: "bg-run-3", to: "/playback" },
  { id: "CA-08", chip: "bg-run-5", to: "/playback" },
]

export type Outcome = "success" | "marginal" | "fail"

export const OUTCOME: Record<Outcome, { pill: string; text: string }> = {
  success: { pill: "bg-nominal/15 text-nominal-fg", text: "text-nominal-fg" },
  marginal: { pill: "bg-warn/15 text-warn-fg", text: "text-warn-fg" },
  fail: { pill: "bg-alarm/15 text-alarm-fg", text: "text-alarm-fg" },
}

export type RunningJob = {
  id: string
  kind: string
  chip: string
  name: string
  sub: string
  pct: number
  line: number[]
  lineClass?: string
  warn?: number
  danger?: number
  inverted?: boolean
}

export const RUNNING: RunningJob[] = [
  {
    id: "MC-032",
    kind: "campaign",
    chip: "bg-run-2",
    name: "CA-08 candidate · nominal sweep",
    sub: "383 / 2,000 episodes · 81% success so far · ~1.5 h left",
    pct: 19.2,
    // success rate (%) as episodes complete
    line: [84, 80, 80, 79, 81, 81, 80, 81, 81, 81, 79, 81],
  },
  {
    id: "CA-08",
    kind: "training",
    chip: "bg-run-5",
    name: "PPO + DR · init CA-07 · Velora Base",
    sub: "18M / 40M steps · sim success 86%",
    pct: 45,
    // sim success (%) over training
    line: [45, 45, 50, 53, 61, 66, 73, 76, 81, 81, 84, 84, 86, 86],
  },
  {
    id: "CA-0419",
    kind: "sim · 10×",
    chip: "bg-run-1",
    name: "Collision avoidance · debris_03 · burn",
    sub: "t = 34 s · predicted miss 15 m → replanning",
    pct: 21,
    // predicted miss distance (m): inside the 75 m keep-out
    line: [15, 15, 15, 15, 15, 15, 18],
    lineClass: "stroke-alarm",
    warn: 150,
    danger: 75,
    inverted: true,
  },
]

export const ATTENTION: {
  title: string
  sub: string
  tag: string
  level: "alarm" | "warn"
}[] = [
  {
    title: "REQ-CA-01 not met · MC-031",
    sub: "Keep-out avoidance 96.8% < 99% inside the envelope",
    tag: "over limit",
    level: "alarm",
  },
  {
    title: "REQ-CA-03 not met · MC-031",
    sub: "Boom margin ≥ 1.25× in 98.1% of runs, needs 99%",
    tag: "over limit",
    level: "alarm",
  },
  {
    title: "CA-0419 · miss 85 m",
    sub: "Inside 150 m warn at TCA · 3rd marginal in 10 episodes",
    tag: "deviating",
    level: "warn",
  },
  {
    title: "CA-0419 · boom root 1.70×",
    sub: "Burn ignition transient · structure model unvalidated",
    tag: "deviating · model",
    level: "warn",
  },
]

export const COVERAGE =
  "3333332221333333222133333322213333332211333333221133333321103333322100333321000033320000003300000000"

export const PINNED: {
  id: string
  chip: string
  name: string
  outcome: EpisodeOutcome
}[] = [
  {
    id: "CA-0419",
    chip: "bg-run-1",
    name: "fragment 0.3 m · 12 m/s · marginal · miss inside 150 m · boom margin 1.70×",
    outcome: "marginal",
  },
  {
    id: "CA-0421",
    chip: "bg-run-3",
    name: "upper stage 2 m · 18 m/s · boom detached during burn",
    outcome: "fail",
  },
]

export const RECENT: {
  id: string
  chip: string
  name: string
  outcome: EpisodeOutcome
  miss: string
  campaign: string
  when: string
}[] = [
  {
    id: "CA-0419",
    chip: "bg-run-1",
    name: "fragment 0.3 m · 12 m/s · marginal · miss inside 150 m · boom margin 1.70×",
    outcome: "marginal",
    miss: "85 m",
    campaign: "MC-031",
    when: "2 min ago",
  },
  {
    id: "CA-4404",
    chip: "bg-run-1",
    name: "irregular rock 1.5 m · second fragment · 3 m/s · clean · two burns",
    outcome: "success",
    miss: "254 m",
    campaign: "MC-032",
    when: "1 min ago",
  },
  {
    id: "CA-4407",
    chip: "bg-run-2",
    name: "fragment 0.3 m · 3 m/s · clean · two burns",
    outcome: "success",
    miss: "265 m",
    campaign: "MC-032",
    when: "3 min ago",
  },
  {
    id: "CA-0421",
    chip: "bg-run-3",
    name: "upper stage 2 m · 18 m/s · boom detached during burn",
    outcome: "fail",
    miss: "61 m",
    campaign: "MC-031",
    when: "41 min ago",
  },
  {
    id: "CA-4414",
    chip: "bg-run-3",
    name: "irregular rock 1.5 m · 11 m/s · clean single burn",
    outcome: "success",
    miss: "159 m",
    campaign: "MC-032",
    when: "5 min ago",
  },
  {
    id: "CA-4422",
    chip: "bg-run-4",
    name: "upper stage 2 m · thr_3 off · 19 m/s · thr_3 saturated",
    outcome: "fail",
    miss: "62 m",
    campaign: "MC-032",
    when: "7 min ago",
  },
  {
    id: "CA-4432",
    chip: "bg-run-5",
    name: "upper stage 2 m · second fragment · 5 m/s · boom detached",
    outcome: "fail",
    miss: "66 m",
    campaign: "MC-032",
    when: "9 min ago",
  },
  {
    id: "CA-4439",
    chip: "bg-run-6",
    name: "irregular rock 1.5 m · 14 m/s · clean single burn",
    outcome: "success",
    miss: "269 m",
    campaign: "MC-032",
    when: "11 min ago",
  },
  {
    id: "CA-4442",
    chip: "bg-run-1",
    name: "fragment 0.3 m · tracker dropout · 9 m/s · clean · two burns",
    outcome: "success",
    miss: "172 m",
    campaign: "MC-031",
    when: "40 min ago",
  },
]

export const MISSIONS = [
  {
    name: "Collision avoidance",
    desc: "sc01 avoiding tracked debris · CW layer · health models",
    tag: "active",
    active: true,
    stats: "5 campaigns · 5,912 runs · last 77.8%",
  },
  {
    name: "Rendezvous and docking",
    desc: "Nanosat module docking · latch loads",
    tag: "spec only",
    active: false,
    stats: "no runs yet",
  },
  {
    name: "Capture and detumble",
    desc: "Servicer + 7-DOF arm · tumbling upper stage",
    tag: "early",
    active: false,
    stats: "1 campaign · 48 runs · last early",
  },
  {
    name: "Low-gravity landing",
    desc: "Powered descent on an irregular body",
    tag: "spec only",
    active: false,
    stats: "no runs yet",
  },
]

export const SYSTEM = [
  { dot: "bg-live", text: "Sim pool · 112 / 128 envs in use" },
  { dot: "bg-live", text: "Velora Base connected · v0.9" },
  { dot: "bg-live", text: "Telemetry store · 1.8 TB free" },
  { dot: "bg-nominal", text: "Nightly regression 02:00 · 94.0% · no change" },
  { dot: "bg-warn", text: "sc01 structure model · unvalidated" },
]
