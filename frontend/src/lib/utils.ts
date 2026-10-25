import { RUN_COLOURS } from "./constants"
export { cn } from "cn"

export const runColourClass = (id: string) => {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0
  return RUN_COLOURS[Math.abs(h) % RUN_COLOURS.length]
}

export const Capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const coverageClass = (p: number) =>
  p < 0
    ? "bg-raised"
    : p >= 0.95
      ? "bg-nominal/60"
      : p >= 0.8
        ? "bg-nominal/30"
        : p >= 0.6
          ? "bg-warn/45"
          : "bg-alarm/50"
