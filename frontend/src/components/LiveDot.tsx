import { cn } from "@/lib/utils"

const LiveDot = ({ active }: { active: boolean }) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        active ? "bg-live-on motion-safe:animate-live" : "bg-live-off"
      )}
    />
  )
}

export default LiveDot
