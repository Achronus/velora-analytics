import type { Crumb } from "@velora/components"

export { cn } from "cn"

export const formatParentIds = (path: Crumb[]) => {
  path
    .filter((c) => c.module !== "mission")
    .map((c) => c.id)
    .join(" / ")
}
