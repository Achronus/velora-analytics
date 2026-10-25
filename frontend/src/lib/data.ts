/* Mock data for the ⌘K search (results list + preview pane), in the SearchHit / PreviewData shapes.
   Converted from the old DemoMenu mock. Until the API exists, the two query hooks call:

     useSearchResults:  queryFn: () => searchMock(q, filter, mission)
     useSearchPreview:  queryFn: () => previewMock(module, id)

   Then swap them to fetch() once /api/v1/search and the preview endpoint are live. */

import { MODULE_ORDER, MODULE_REGISTRY, hrefOf } from "@/lib/search/registry"
import type {
  Crumb,
  PreviewData,
  SearchGroup,
  SearchHit,
  SearchResponse,
} from "@/lib/search/types"
import type { Filter, ModuleFormat } from "@/lib/types"

/* ==========================================================================
   Generators (deterministic, so the data is the same on every load)
   ========================================================================== */

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

/** Repeatable pseudo-random number in [0, 1) for a given seed. */
const seeded = (seed: number) => {
  const v = Math.sin(seed * 12.9898 + 7.3) * 43758.5453
  return v - Math.floor(v)
}

/** Gaussian bump centred on c with width w. */
const bump = (t: number, c: number, w: number) =>
  Math.exp(-(((t - c) / w) ** 2))

/** Sample times for a 160 s episode, every 2 s. */
const EPISODE_TIMES = Array.from({ length: 81 }, (_, i) => i * 2)

/** Predicted miss distance over a 160 s episode, ending at `miss`. */
const missTrace = (miss: number) =>
  EPISODE_TIMES.map((t) =>
    t < 30
      ? 9
      : t < 52
        ? 9 + ((t - 30) / 22) ** 1.6 * (miss - 9) * 0.55
        : t < 100
          ? miss * (0.55 + 0.45 * Math.min(1, (t - 52) / 30))
          : miss
  )

/** 10 × 10 coverage grid (closing speed × detection range), 0–1 success; -1 = not run yet. */
const coverageGrid = (shift = 0, done = 100) =>
  Array.from({ length: 100 }, (_, i) => {
    if (i >= done) return -1
    const speed = 2 + (i % 10) * 2
    const range = 300 + (9 - Math.floor(i / 10)) * 190
    const timeToTca = range / speed
    return (
      sigmoid((timeToTca - 48 - shift) / 7) *
      (1 - 0.22 * sigmoid((speed - 15 + shift / 2) / 1.5))
    )
  })

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString()

/* ==========================================================================
   Shared ancestors
   ========================================================================== */

const CA = "collision-avoidance"
const MISSION: Crumb = {
  module: "mission",
  id: CA,
  name: "Collision avoidance",
}

const CAMPAIGN_NAMES: Record<string, string> = {
  "MC-032": "CA-08 candidate · nominal sweep",
  "MC-031": "CA-07 vs cam_classic · nominal sweep",
  "MC-029": "High closing speed stress",
  "MC-027": "Thruster failure injection",
}
const campaignCrumb = (id: string): Crumb => ({
  module: "campaign",
  id,
  name: CAMPAIGN_NAMES[id],
})

/** The eval run inside each campaign (episodes hang off these). */
const EVAL_RUN: Record<string, { id: string; name: string }> = {
  "MC-032": { id: "EV-0321", name: "CA-08 @ 18M eval" },
  "MC-031": { id: "EV-0311", name: "CA-07 @ 40M eval" },
  "MC-029": { id: "EV-0291", name: "CA-07 stress eval" },
  "MC-027": { id: "EV-0271", name: "CA-07 thr_3 failure eval" },
}
const evalCrumb = (campaignId: string): Crumb => ({
  module: "run",
  ...EVAL_RUN[campaignId],
})

/* ==========================================================================
   Hits + previews (built together so every hit has a preview)
   ========================================================================== */

const HITS: SearchHit[] = []
const PREVIEWS = new Map<string, PreviewData>()

const previewKey = (module: ModuleFormat, id: string) => `${module}:${id}`
/** Primary action: goes where ↵ goes (hrefOf), so the button and the key always agree. */
const ENTER = (label: string) => ({ label, href: "", key: "↵" })

const add = (hit: SearchHit, preview: PreviewData) => {
  HITS.push(hit)
  const actions = preview.actions?.map((a) =>
    a.key === "↵" ? { ...a, href: hrefOf(hit) } : a
  )
  PREVIEWS.set(previewKey(hit.module, hit.id), { ...preview, actions })
}

/* ---------- missions ---------- */

const MISSIONS = [
  {
    id: CA,
    name: "Collision avoidance",
    description: "sc01 avoiding tracked debris · CW layer · health models",
    campaigns: 4,
    episodes: 5912,
    state: "active" as const,
    note: undefined,
  },
  {
    id: "rendezvous-docking",
    name: "Rendezvous and docking",
    description: "Nanosat module docking · latch loads",
    campaigns: 0,
    episodes: 0,
    state: "spec" as const,
    note: "Mission spec drafted, not implemented yet.",
  },
  {
    id: "capture-detumble",
    name: "Capture and detumble",
    description: "Servicer + 7-DOF arm · tumbling upper stage",
    campaigns: 1,
    episodes: 48,
    state: "spec" as const,
  },
  {
    id: "low-g-landing",
    name: "Low-gravity landing",
    description: "Powered descent on an irregular body",
    campaigns: 0,
    episodes: 0,
    state: "spec" as const,
  },
]

for (const m of MISSIONS) {
  add(
    {
      module: "mission",
      id: m.id,
      name: m.name,
      path: [],
      data: {
        description: m.description,
        campaigns: m.campaigns,
        episodes: m.episodes,
        state: m.state,
      },
    },
    {
      facts: [
        { k: "Campaigns", v: String(m.campaigns) },
        { k: "Episodes", v: m.episodes.toLocaleString("en-GB") },
        ...(m.id === CA
          ? [
              { k: "Last success", v: "77.8%" },
              { k: "Spacecraft", v: "sc01 v3" },
            ]
          : []),
      ],
      note: m.note
        ? `${m.note} ↵ searches within this mission.`
        : "↵ searches within this mission and switches the breadcrumb to it.",
      // ↵ on a mission scopes the search instead of navigating, so no action carries the ↵ hint here
      actions: [
        { label: "Dashboards", href: `/dashboards?mission=${m.id}` },
        { label: "New run", href: `/configs?mission=${m.id}` },
      ],
    }
  )
}

/* ---------- campaigns + their eval runs ---------- */

const CAMPAIGNS = [
  {
    id: "MC-032",
    running: true,
    done: 383,
    total: 2000,
    success: 0.81,
    policy: { runId: "CA-08", step: 18e6 },
    coverage: coverageGrid(0, 19),
    reqs: undefined,
    note: "Running on 64 vectorised envs. env 17 flagged as an outlier.",
    extra: { k: "Requirements", v: "pending" },
  },
  {
    id: "MC-031",
    running: false,
    done: 2000,
    total: 2000,
    success: 0.778,
    policy: { runId: "CA-07", step: 40e6 },
    coverage: coverageGrid(),
    reqs: { met: 3, total: 5 },
    note: "REQ-CA-01 (keep-out) and REQ-CA-03 (boom margin) not met.",
    extra: { k: "Requirements", v: "3 / 5 met", tone: "alarm" as const },
  },
  {
    id: "MC-029",
    running: false,
    done: 500,
    total: 500,
    success: 0.612,
    policy: { runId: "CA-07", step: 40e6 },
    coverage: coverageGrid(6),
    reqs: undefined,
    note: undefined,
    extra: { k: "Top failure", v: "boom overload", tone: "alarm" as const },
  },
  {
    id: "MC-027",
    running: false,
    done: 1000,
    total: 1000,
    success: 0.704,
    policy: { runId: "CA-07", step: 40e6 },
    coverage: coverageGrid(3),
    reqs: undefined,
    note: undefined,
    extra: { k: "Injected", v: "thr_3 stuck off" },
  },
]

for (const c of CAMPAIGNS) {
  const pct = `${(c.success * 100).toFixed(1)}%${c.running ? " so far" : ""}`
  const policy = `${c.policy.runId} @ ${c.policy.step / 1e6}M`
  const successTone =
    c.success >= 0.75 ? ("nominal" as const) : ("warn" as const)
  const facts = [
    {
      k: "Episodes",
      v: `${c.done.toLocaleString("en-GB")} / ${c.total.toLocaleString("en-GB")}`,
    },
    { k: "Success", v: pct, tone: successTone },
    { k: "Policy", v: policy },
    c.extra,
  ]

  add(
    {
      module: "campaign",
      id: c.id,
      name: CAMPAIGN_NAMES[c.id],
      path: [MISSION],
      data: {
        description: CAMPAIGN_NAMES[c.id],
        runs: 1,
        running: c.running ? 1 : 0,
      },
    },
    {
      facts,
      note: c.note,
      coverage: c.coverage,
      actions: [
        ENTER("Open campaign"),
        { label: "Episodes", href: `/campaigns/${c.id}/episodes` },
        ...(c.id === "MC-031"
          ? [{ label: "Worst run", href: "/playback?episode=CA-0421" }]
          : []),
      ],
    }
  )

  const run = EVAL_RUN[c.id]
  add(
    {
      module: "run",
      id: run.id,
      name: run.name,
      path: [MISSION, campaignCrumb(c.id)],
      data: {
        type: "eval",
        status: c.running ? "running" : "complete",
        policy: c.policy,
        episodesDone: c.done,
        episodeCount: c.total,
        successRate: c.success,
        requirements: c.reqs,
      },
    },
    {
      facts,
      note: c.note,
      coverage: c.coverage,
      actions: [
        ENTER("Results"),
        { label: "Episodes", href: `/campaigns/${c.id}/episodes` },
      ],
    }
  )
}

/* ---------- training run ---------- */

add(
  {
    module: "run",
    id: "CA-08",
    name: "PPO + DR · init CA-07",
    path: [MISSION],
    data: {
      type: "train",
      status: "running",
      algorithm: "PPO",
      stepsDone: 18e6,
      totalSteps: 40e6,
      successRate: 0.86,
    },
  },
  {
    facts: [
      { k: "Steps", v: "18M / 40M" },
      { k: "Algorithm", v: "PPO" },
      { k: "Sim success", v: "86%", tone: "nominal" },
      { k: "approx_kl", v: "0.012" },
    ],
    series: {
      label: "sim success rate",
      value: "86% @ 18M",
      values: Array.from(
        { length: 40 },
        (_, i) => 100 * 0.9 * sigmoid((i - 9) / 3) + (seeded(i) - 0.5) * 3
      ),
    },
    actions: [
      ENTER("Training curves"),
      {
        label: "Evaluate checkpoint",
        href: "/configs?preset=eval&checkpoint=CA-08",
      },
    ],
  }
)

/* ---------- agents (promoted checkpoints and candidates) ---------- */

const AGENTS = [
  {
    id: "AG-07",
    name: "CA-07 · PPO + DR",
    checkpoint: { runId: "CA-07", step: 40e6 },
    promoted: true,
    evaluatedIn: 3,
    success: "77.8% (MC-031)",
  },
  {
    id: "AG-08",
    name: "CA-08 candidate",
    checkpoint: { runId: "CA-08", step: 18e6 },
    promoted: false,
    evaluatedIn: 1,
    success: "81% so far (MC-032)",
  },
  {
    id: "AG-06",
    name: "CA-06 · PPO",
    checkpoint: { runId: "CA-06", step: 32e6 },
    promoted: false,
    evaluatedIn: 2,
    success: "71.0% (MC-024)",
  },
]

for (const a of AGENTS) {
  add(
    {
      module: "agent",
      id: a.id,
      name: a.name,
      path: [MISSION],
      data: {
        checkpoint: a.checkpoint,
        algorithm: "PPO",
        promoted: a.promoted,
        evaluatedIn: a.evaluatedIn,
      },
    },
    {
      facts: [
        {
          k: "Checkpoint",
          v: `${a.checkpoint.runId} @ ${a.checkpoint.step / 1e6}M`,
        },
        { k: "Algorithm", v: "PPO" },
        { k: "Evaluated in", v: `${a.evaluatedIn} runs` },
        {
          k: "Best success",
          v: a.success,
          tone: a.promoted ? "nominal" : undefined,
        },
      ],
      note: a.promoted
        ? "Promoted: the default policy for new campaigns."
        : undefined,
      actions: [
        ENTER("Open agent"),
        { label: "Evaluate", href: `/configs?preset=eval&agent=${a.id}` },
      ],
    }
  )
}

/* ---------- environments (debris variants) ---------- */

const ENVIRONMENTS = [
  {
    id: "ENV-01",
    name: "Fragment 0.3 m",
    description: "small tumbling fragment",
    randomised: 6,
    episodes: 3120,
  },
  {
    id: "ENV-02",
    name: "Upper stage 2 m",
    description: "spent upper stage · CoACD hulls",
    randomised: 5,
    episodes: 1840,
  },
  {
    id: "ENV-03",
    name: "Irregular rock 1.5 m",
    description: "irregular body · shape randomised",
    randomised: 8,
    episodes: 952,
  },
]

for (const e of ENVIRONMENTS) {
  add(
    {
      module: "environment",
      id: e.id,
      name: e.name,
      path: [MISSION],
      data: {
        description: e.description,
        randomised: e.randomised,
        episodes: e.episodes,
      },
    },
    {
      facts: [
        { k: "Randomised params", v: String(e.randomised) },
        { k: "Episodes", v: e.episodes.toLocaleString("en-GB") },
        { k: "Orbit", v: "LEO 550 km" },
        { k: "Spacecraft", v: "sc01 v3" },
      ],
      actions: [
        ENTER("Open environment"),
        { label: "New run with it", href: `/configs?environment=${e.id}` },
      ],
    }
  )
}

/* ---------- episodes (the old "runs": CA-0419 etc.) ---------- */

type EpisodeSeed = {
  id: string
  outcome: "success" | "marginal" | "fail"
  miss: number
  speed: number
  debris: string
  perturbation?: string
  why: string
  campaign: string
  minutesAgo: number
  live?: boolean
}

const DEBRIS = ["fragment 0.3 m", "upper stage 2 m", "irregular rock 1.5 m"]
const PERTURBATIONS = [
  "",
  "",
  "thr_3 off",
  "tracker dropout",
  "second fragment",
]
const WHY = {
  fail: ["late detection", "boom detached", "thr_3 saturated"],
  marginal: ["miss inside 150 m", "boom margin < 2.0×"],
  success: ["clean single burn", "clean · two burns"],
}

const EPISODES: EpisodeSeed[] = [
  {
    id: "CA-0419",
    outcome: "marginal",
    miss: 85,
    speed: 12,
    debris: "fragment 0.3 m",
    why: "miss inside 150 m · boom margin 1.70×",
    campaign: "MC-031",
    minutesAgo: 2,
    live: true,
  },
  {
    id: "CA-0421",
    outcome: "fail",
    miss: 61,
    speed: 18,
    debris: "upper stage 2 m",
    why: "boom detached during burn",
    campaign: "MC-031",
    minutesAgo: 41,
  },
  ...Array.from({ length: 24 }, (_, k): EpisodeSeed => {
    const u = seeded(k + 3)
    const outcome = u < 0.14 ? "fail" : u < 0.28 ? "marginal" : "success"
    const miss =
      outcome === "fail"
        ? 25 + 45 * seeded(k + 1)
        : outcome === "marginal"
          ? 80 + 65 * seeded(k + 2)
          : 155 + 120 * seeded(k + 4)
    return {
      id: `CA-${4400 + k * 7}`,
      outcome,
      miss,
      speed: 2 + Math.round(seeded(k + 6) * 18),
      debris: DEBRIS[Math.floor(seeded(k + 9) * 3)],
      perturbation:
        PERTURBATIONS[Math.floor(seeded(k + 5) * PERTURBATIONS.length)] ||
        undefined,
      why: WHY[outcome][Math.floor(seeded(k + 8) * WHY[outcome].length)],
      campaign: k < 6 ? "MC-032" : k < 18 ? "MC-031" : "MC-029",
      minutesAgo: k < 6 ? k * 2 + 1 : k < 18 ? 40 : 26 * 60,
    }
  }),
]

EPISODES.forEach((e, i) => {
  const policy = e.campaign === "MC-032" ? "CA-08 @ 18M" : "CA-07 @ 40M"
  add(
    {
      module: "episode",
      id: e.id,
      name: [e.debris, e.perturbation, `${e.speed} m/s`]
        .filter(Boolean)
        .join(" · "),
      path: [MISSION, campaignCrumb(e.campaign), evalCrumb(e.campaign)],
      data: {
        status: e.live ? "running" : "done",
        outcome: e.live ? undefined : e.outcome,
        envIndex: Math.floor(seeded(i + 11) * 64),
        headline: e.why,
        startedAt: minutesAgo(e.minutesAgo),
      },
    },
    {
      series: {
        label: "predicted miss distance · 0–160 s",
        value: `${e.miss.toFixed(0)} m at TCA`,
        values: missTrace(e.miss),
        warn: 150,
        limit: 75,
        inverted: true,
      },
      facts: [
        {
          k: "Miss at TCA",
          v: `${e.miss.toFixed(0)} m`,
          tone:
            e.outcome === "fail"
              ? "alarm"
              : e.outcome === "marginal"
                ? "warn"
                : "nominal",
        },
        { k: "Closing speed", v: `${e.speed} m/s` },
        { k: "Campaign", v: e.campaign },
        { k: "Policy", v: policy },
      ],
      note: `${e.why[0].toUpperCase()}${e.why.slice(1)}. ${e.live ? "Replaying live at 10×." : "Recorded in full."}`,
      actions: [
        ENTER(e.live ? "Live" : "Playback"),
        { label: "Telemetry", href: `/telemetry?episode=${e.id}` },
        { label: "Branch", href: `/playback?episode=${e.id}&branch=1` },
      ],
    }
  )
})

/* ---------- channels ---------- */

type ChannelSeed = {
  id: string
  desc: string
  model: string // "Modal boom · 3 modes · unvalidated"
  level: 0 | 1 | 2
  unit: string
  warn?: number
  limit?: number
  worst: string
  values: number[]
  inverted?: boolean // lower is worse
}

const CHANNELS: ChannelSeed[] = [
  {
    id: "gnc.debris_03.miss_pred",
    desc: "Predicted miss distance at closest approach",
    model: "CW relative motion · J2 off",
    level: 2,
    unit: "m",
    warn: 150,
    limit: 75,
    worst: "7 m",
    values: missTrace(85),
    inverted: true,
  },
  {
    id: "gnc.debris_03.range",
    desc: "Distance to debris_03",
    model: "CW relative motion · J2 off",
    level: 0,
    unit: "m",
    worst: "85 m",
    values: EPISODE_TIMES.map(
      (t) => Math.abs(12 * (100 - t)) + 85 * bump(t, 100, 8)
    ),
  },
  {
    id: "sc01.struct.boom_root.load_margin",
    desc: "Strength over load at the boom root · breaks below 1.0",
    model: "Modal boom · 3 modes · unvalidated",
    level: 1,
    unit: "×",
    warn: 2.0,
    limit: 1.25,
    worst: "1.70×",
    values: EPISODE_TIMES.map(
      (t) => 6.2 - 4.5 * bump(t, 31, 1.8) - 2.5 * bump(t, 52, 1.6)
    ),
    inverted: true,
  },
  {
    id: "sc01.struct.bus.accel_rms",
    desc: "Bus vibration, RMS over 0.5 s",
    model: "Accelerometer · MuJoCo + modal",
    level: 1,
    unit: "g",
    warn: 0.05,
    limit: 0.1,
    worst: "0.065 g",
    values: EPISODE_TIMES.map(
      (t) => 0.002 + 0.053 * bump(t, 31, 2) + 0.02 * bump(t, 52, 1.5)
    ),
  },
  {
    id: "sc01.prop.thr_3.temp",
    desc: "Thruster 3 valve temperature",
    model: "Lumped thermal · 2 nodes · unvalidated",
    level: 1,
    unit: "°C",
    warn: 55,
    limit: 70,
    worst: "57.6 °C",
    values: EPISODE_TIMES.map((t) =>
      t < 30
        ? 22
        : t < 52
          ? 22 + 39 * (1 - Math.exp(-(t - 30) / 9))
          : 24 + 33.6 * Math.exp(-(t - 52) / 25)
    ),
  },
  {
    id: "sc01.prop.thr_3.duty",
    desc: "Thruster 3 on-time over a 1 s window",
    model: "Thruster model · MIB 20 ms",
    level: 1,
    unit: "%",
    warn: 80,
    limit: 95,
    worst: "90%",
    values: EPISODE_TIMES.map((t) =>
      t >= 30 && t < 52 ? 86 + 4 * Math.sin(t * 1.3) : 0
    ),
  },
  {
    id: "sc01.prop.dv_used",
    desc: "Δv spent this episode · budget 3.0 m/s",
    model: "Ideal rocket eq. · Isp 220 s",
    level: 0,
    unit: "m/s",
    warn: 2.0,
    limit: 2.6,
    worst: "1.54 m/s",
    values: EPISODE_TIMES.map((t) => 0.07 * Math.min(22, Math.max(0, t - 30))),
  },
  {
    id: "sc01.thermal.panel_a.temp",
    desc: "Solar panel A temperature",
    model: "Lumped thermal · 4 nodes · unvalidated",
    level: 0,
    unit: "°C",
    warn: 80,
    limit: 95,
    worst: "64.0 °C",
    values: EPISODE_TIMES.map((t) =>
      t < 120 ? 58 + (6 * t) / 120 : 64 - 30 * (1 - Math.exp(-(t - 120) / 20))
    ),
  },
  {
    id: "policy.ood",
    desc: "Out-of-distribution score of current observations",
    model: "Velora Base · ensemble",
    level: 0,
    unit: "",
    warn: 0.5,
    limit: 0.7,
    worst: "0.42",
    values: EPISODE_TIMES.map(
      (t) => 0.18 + 0.24 * bump(t, 8, 6) + 0.1 * bump(t, 100, 5)
    ),
  },
]

for (const c of CHANNELS) {
  const unvalidated = c.model.includes("unvalidated")
  add(
    {
      module: "channel",
      id: c.id,
      name: c.desc,
      path: [MISSION],
      data: {
        desc: c.desc,
        unit: c.unit || undefined,
        source: c.id.startsWith("policy.") ? "agent" : "env",
        level: c.level,
        validated: !unvalidated,
      },
    },
    {
      series: {
        label: "CA-0419 · 0–160 s",
        value: `worst ${c.worst}`,
        values: c.values,
        warn: c.warn,
        limit: c.limit,
        inverted: c.inverted,
      },
      facts: [
        {
          k: "Warn / limit",
          v:
            c.warn != null
              ? `${c.warn} / ${c.limit} ${c.unit}`.trim()
              : "no rule",
        },
        { k: "Unit", v: c.unit || "—" },
        {
          k: "Model",
          v: c.model.split(" · ")[0],
          tone: unvalidated ? "model" : undefined,
        },
        {
          k: "Fidelity",
          v: unvalidated ? "unvalidated" : "ok",
          tone: unvalidated ? "model" : undefined,
        },
      ],
      note: `${c.desc}. Opens in Telemetry scoped to the selected run.`,
      actions: [
        ENTER("Plot in Telemetry"),
        {
          label: "Edit rule",
          href: `/monitoring?rule=${encodeURIComponent(c.id)}`,
        },
      ],
    }
  )
}

/* ==========================================================================
   Mock endpoints
   ========================================================================== */

const LATENCY_MS = 150 // enough to see the loading states
const delay = <T>(value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), LATENCY_MS))

const find = (module: ModuleFormat, id: string) => {
  const hit = HITS.find((h) => h.module === module && h.id === id)
  if (!hit) throw new Error(`mock data: no ${module} "${id}"`)
  return hit
}

/** Everything a query should match against for a hit: ids, names, ancestors and text fields. */
const searchableText = (hit: SearchHit) => {
  const text: unknown[] = [
    hit.id,
    hit.name,
    ...hit.path.map((c) => c.id),
    ...Object.values(hit.data),
  ]
  if (hit.module === "channel" && hit.data.validated === false)
    text.push("unvalidated")
  if (hit.module === "episode") text.push(`env ${hit.data.envIndex}`)
  if (hit.module === "run" && hit.data.type === "eval")
    text.push(hit.data.policy.runId)
  return text
    .filter(
      (v): v is string | number =>
        typeof v === "string" || typeof v === "number"
    )
    .join(" ")
    .toLowerCase()
}

const countByModule = (hits: SearchHit[]) => {
  const counts: Partial<Record<ModuleFormat, number>> = {}
  for (const h of hits) counts[h.module] = (counts[h.module] ?? 0) + 1
  return counts
}

/** Missions always show (so you can switch); everything else must belong to the scoped mission. */
const inMission = (mission: string | null) => (hit: SearchHit) =>
  !mission || hit.module === "mission" || hit.path[0]?.id === mission

/** Stand-in for GET /api/v1/search?q=…&module=…&mission=… */
export const searchMock = (
  q: string,
  filter: Filter,
  mission: string | null = null
): Promise<SearchResponse> => {
  const query = q.trim().toLowerCase()
  const scoped = HITS.filter(inMission(mission))

  // Nothing typed, "All" tab: running / pinned / recent, like the real home state
  if (!query && filter === "all") {
    const groups: SearchGroup[] = [
      {
        key: "running",
        heading: "RUNNING NOW",
        hits: [
          find("campaign", "MC-032"),
          find("run", "CA-08"),
          find("episode", "CA-0419"),
        ],
      },
      {
        key: "pinned",
        heading: "PINNED",
        hits: [
          find("campaign", "MC-031"),
          find("episode", "CA-0419"),
          find("episode", "CA-0421"),
        ],
      },
      {
        key: "recent",
        heading: "RECENT",
        hits: HITS.filter((h) => h.module === "episode").slice(2, 7),
      },
    ]
      .map((g) => ({ ...g, hits: g.hits.filter(inMission(mission)) }))
      .filter((g) => g.hits.length > 0)
    return delay({ groups, counts: countByModule(scoped) })
  }

  // Typed: match text. Not typed but a tab chosen: browse everything of that module.
  const matches = query
    ? scoped.filter((h) => searchableText(h).includes(query))
    : scoped

  const groups: SearchGroup[] = MODULE_ORDER.filter(
    (m) => filter === "all" || filter === m
  )
    .map((m) => {
      const hits = matches.filter((h) => h.module === m)
      // browsing channels: flagged ones first
      if (!query && m === "channel") {
        hits.sort(
          (a, b) =>
            (b.module === "channel" ? (b.data.level ?? 0) : 0) -
            (a.module === "channel" ? (a.data.level ?? 0) : 0)
        )
      }
      const limit = filter === "all" ? MODULE_REGISTRY[m].limit : 50
      return {
        key: m,
        heading: MODULE_REGISTRY[m].label.toUpperCase(),
        hits: hits.slice(0, limit),
      }
    })
    .filter((g) => g.hits.length > 0)

  return delay({ groups, counts: countByModule(matches) })
}

/** Stand-in for GET /api/search/preview/:module/:id */
export const previewMock = (
  module: ModuleFormat,
  id: string
): Promise<PreviewData> => {
  const preview = PREVIEWS.get(previewKey(module, id))
  return preview
    ? delay(preview)
    : Promise.reject(new Error(`mock data: no preview for ${module} "${id}"`))
}
