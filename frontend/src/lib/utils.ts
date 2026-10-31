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
