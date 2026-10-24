import type { ISODate, ModuleFormat } from "@/lib/types"
import type { Crumb, HitOf } from "./types"
import { PATH_SEGMENT, RUN_COLOURS } from "./constants"

export const formatTimeAgo = (iso: ISODate): string => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return `${Math.round(s / 86400)} d ago`
}

export const formatPercent = (x?: number) =>
  x == null ? "-" : `${(x * 100).toFixed(1)}%`

export const formatParentIds = (path: Crumb[]) => {
  path
    .filter((c) => c.module !== "mission")
    .map((c) => c.id)
    .join(" / ")
}

export const buildEntityPath = (path: Crumb[], leaf?: Crumb, suffix = "") =>
  [...path, ...(leaf ? [leaf] : [])]
    .filter((c) => PATH_SEGMENT[c.module])
    .map((c) => `/${PATH_SEGMENT[c.module]}/${encodeURIComponent(c.id)}`)
    .join("") + suffix

export const toCrumb = <M extends ModuleFormat>(h: HitOf<M>): Crumb => ({
  module: h.module,
  id: h.id,
  name: h.name,
})

export const runColourClass = (id: string) => {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0
  return RUN_COLOURS[Math.abs(h) % RUN_COLOURS.length]
}

export const formatMillion = (value: number) => {
  return `${(value / 1e6).toFixed(0)}M`
}
