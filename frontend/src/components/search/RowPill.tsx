import type { RowDisplay, Tone } from "@/lib/search/types"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

const PILL: Record<Tone, string> = {
  nominal: "bg-nominal/15 text-nominal-fg",
  warn: "bg-warn/15 text-warn-fg",
  alarm: "bg-alarm/15 text-alarm-fg",
  live: "bg-live/12 text-live-fg",
  model: "bg-model/15 text-model",
  neutral: "bg-secondary text-text-dim",
}

const RowPill = ({ pill }: { pill: NonNullable<RowDisplay["pill"]> }) => {
  return (
    <Badge
      variant="secondary"
      className={
        (cn("rounded px-1.75 py-px text-[11px] font-normal"), PILL[pill.tone])
      }
    >
      {pill.label}
    </Badge>
  )
}

export default RowPill
