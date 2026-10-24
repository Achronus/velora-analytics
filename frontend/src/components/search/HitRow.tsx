import type { RowDisplay } from "@/lib/search/types"
import { cn } from "@/lib/utils"
import Chip from "./Chip"
import RowPill from "./RowPill"

const HitRow = ({ row }: { row: RowDisplay }) => {
  return (
    <>
      {row.chip && <Chip chip={row.chip} />}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "shrink-0 text-[13px] text-text",
              row.mono && "font-mono"
            )}
          >
            {row.title}
          </span>
          {row.name && (
            <span className="truncate text-xs text-dim">{row.name}</span>
          )}
        </div>
        <div className="truncate text-xs text-mute">{row.sub}</div>
      </div>
      {row.pill && <RowPill pill={row.pill} />}
    </>
  )
}

export default HitRow
