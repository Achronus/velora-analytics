import "@velora/components"
import type { SearchHitData } from "./lib/types"

declare module "@velora/components" {
  interface Register {
    modules: SearchHitData
    tone: "nominal" | "warn" | "alarm" | "live" | "model" | "neutral" | "mute"
  }
}
