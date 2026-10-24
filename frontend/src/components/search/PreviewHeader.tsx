import type { RowDisplay } from "@/lib/search/types"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import Chip from "./Chip"
import RowPill from "./RowPill"

type Props = {
  row: RowDisplay
  onOpen: () => void
}

const PreviewHeader = ({ row, onOpen }: Props) => {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {row.chip && <Chip chip={row.chip} />}

          <span className={cn("truncate text-[15px]", row.mono && "font-mono")}>
            {row.title}
          </span>

          {row.pill && <RowPill pill={row.pill} />}
        </div>

        {row.name && (
          <div className="mt-1 truncate text-[13px] text-dim">{row.name}</div>
        )}
        <div className="mt-0.5 text-xs text-mute">{row.sub}</div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onOpen}
        className="h-7.5 gap-1 px-2.5 text-xs font-normal"
      >
        Open <ArrowRight className="size-3" />
      </Button>
    </div>
  )
}

export default PreviewHeader
