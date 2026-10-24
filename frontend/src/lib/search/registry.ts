import type { ModuleFormat } from "@/lib/types"
import {
  buildEntityPath,
  formatMillion,
  formatParentIds,
  formatPercent,
  formatTimeAgo,
  runColourClass,
  toCrumb,
} from "@/lib/search/utils"
import { LEVEL_CHIP, LEVEL_TONE, OUTCOME_TONE, STATUS_TONE } from "./constants"
import {
  type HitOf,
  type ModuleSpec,
  type RowDisplay,
  type SearchHit,
} from "./types"
import { preview } from "@/components/search/FactsPreview"

export const MODULE_REGISTRY: { [M in ModuleFormat]: ModuleSpec<M> } = {
  mission: {
    label: "Missions",
    limit: 3,
    row: (h) => ({
      title: h.name,
      sub:
        h.data.description ??
        `${h.data.campaigns} campaigns . ${h.data.episodes.toLocaleString("en-GB")} episodes`,
      chip: { className: "border-text-dim", shape: "outline" },
      pill:
        h.data.state === "active"
          ? { label: "active", tone: "live" }
          : { label: "spec only", tone: "neutral" },
    }),
    href: (h) => buildEntityPath([], toCrumb(h)),
    Preview: preview<"mission">(),
  },

  campaign: {
    label: "Campaigns",
    limit: 4,
    row: (h) => ({
      title: h.id,
      mono: true,
      name: h.name,
      sub: `${h.data.runs} run${h.data.runs === 1 ? "" : "s"}${h.data.running ? ` . ${h.data.running} running` : ""}`,
      chip: { className: runColourClass(h.id), shape: "square" },
      pill: h.data.running ? { label: "running", tone: "live" } : undefined,
    }),
    href: (h) => buildEntityPath(h.path, toCrumb(h)),
    Preview: preview<"campaign">(),
  },

  run: {
    label: "Runs",
    limit: 4,
    row: (h) => {
      const d = h.data
      const sub =
        d.type === "train"
          ? `train · ${d.algorithm} · ${formatMillion(d.stepsDone)} / ${formatMillion(d.totalSteps)} steps · success ${formatPercent(d.successRate)}`
          : `eval · ${d.policy.runId} @ ${formatMillion(d.policy.step)} · ${d.episodesDone.toLocaleString("en-GB")} / ${d.episodeCount.toLocaleString("en-GB")} episodes${
              d.requirements
                ? ` · ${d.requirements.met}/${d.requirements.total} reqs`
                : ""
            }`
      return {
        title: h.id,
        mono: true,
        name: h.name,
        sub: [sub, formatParentIds(h.path)].filter(Boolean).join(" · "),
        chip: { className: runColourClass(h.id), shape: "square" },
        pill: { label: d.status, tone: STATUS_TONE[d.status] },
      }
    },
    href: (h) =>
      buildEntityPath(
        h.path,
        toCrumb(h),
        h.data.type === "train" ? "/training" : "/results"
      ),
    Preview: preview<"run">(),
  },

  agent: {
    label: "Agents",
    limit: 3,
    row: (h) => ({
      title: `${h.data.checkpoint.runId} @ ${formatMillion(h.data.checkpoint.step)}`,
      mono: true,
      name: h.name,
      sub: [
        h.data.algorithm,
        `evaluated in ${h.data.evaluatedIn} runs`,
        formatParentIds(h.path),
      ]
        .filter(Boolean)
        .join(" · "),
      chip: {
        className: runColourClass(h.data.checkpoint.runId),
        shape: "square",
      },
      pill: h.data.promoted
        ? { label: "promoted", tone: "nominal" }
        : undefined,
    }),
    href: (h) =>
      buildEntityPath(h.path, undefined, `/agents/${encodeURIComponent(h.id)}`),
    Preview: preview<"agent">(),
  },

  environment: {
    label: "Environments",
    limit: 3,
    row: (h) => ({
      title: h.name,
      sub: `${h.data.description ? `${h.data.description} · ` : ""}${h.data.randomised} randomised params · ${h.data.episodes.toLocaleString("en-GB")} episodes`,
      chip: { className: "bg-line-strong", shape: "square" },
    }),
    href: (h) =>
      buildEntityPath(
        h.path,
        undefined,
        `/environments/${encodeURIComponent(h.id)}`
      ),
    Preview: preview<"environment">(),
  },

  episode: {
    label: "Episodes",
    limit: 6,
    row: (h) => {
      const d = h.data
      const running = d.status === "running"

      return {
        title: h.id,
        mono: true,
        name: h.name,
        sub: [
          d.headline,
          `env ${d.envIndex}`,
          formatParentIds(h.path),
          formatTimeAgo(d.startedAt),
        ]
          .filter(Boolean)
          .join(" · "),
        chip: { className: runColourClass(h.id), shape: "square" },
        pill: running
          ? { label: "running", tone: "live" }
          : d.outcome
            ? {
                label: d.outcome.replace("_", " "),
                tone: OUTCOME_TONE[d.outcome],
              }
            : undefined,
      }
    },
    href: (h) =>
      buildEntityPath(
        h.path,
        toCrumb(h),
        h.data.status === "running" ? "/live" : "/playback"
      ),
    Preview: preview<"episode">(),
  },

  channel: {
    label: "Channels",
    limit: 5,
    row: (h) => {
      const lv = h.data.level ?? 0

      return {
        title: h.id,
        mono: true,
        sub: [
          h.data.desc,
          h.data.unit,
          h.data.source,
          h.data.validated === false ? "unvalidated" : undefined,
        ]
          .filter(Boolean)
          .join(" · "),
        chip: { className: LEVEL_CHIP[lv], shape: "dot" },
        pill: lv
          ? {
              label: lv === 2 ? "over limit" : "deviating",
              tone: LEVEL_TONE[lv],
            }
          : undefined,
      }
    },
    href: (h) =>
      buildEntityPath(
        h.path,
        undefined,
        `/telemetry?plot=${encodeURIComponent(h.id)}`
      ),
    Preview: preview<"channel">(),
  },
}

export const MODULE_ORDER = Object.keys(MODULE_REGISTRY) as ModuleFormat[]

export const getModuleSpec = <M extends ModuleFormat>(
  hit: HitOf<M>
): ModuleSpec<M> => MODULE_REGISTRY[hit.module]

export const rowOf = (hit: SearchHit): RowDisplay => getModuleSpec(hit).row(hit)

export const hrefOf = (hit: SearchHit): string => getModuleSpec(hit).href(hit)

export const hitKey = (groupKey: string, hit: SearchHit) =>
  `${groupKey}:${hit.module}:${hit.id}`
