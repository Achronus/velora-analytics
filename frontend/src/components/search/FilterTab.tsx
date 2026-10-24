import type { Filter } from "@/lib/types"
import { ToggleGroupItem } from "../ui/toggle-group"

type Props = {
  value: Filter
  label: string
  count?: number
}

const FilterTab = ({ value, label, count }: Props) => {
  return (
    <ToggleGroupItem
      value={value}
      className="h-7 min-w-0 flex-none gap-1.5 rounded-md px-2.5 text-[13px] font-normal text-muted-foreground first:rounded-md last:rounded-md hover:bg-transparent hover:text-text data-[state=on]:bg-accent data-[state=on]:text-text"
    >
      {label}
      {count !== undefined && (
        <span className="font-mono text-[11px] text-mute">{count}</span>
      )}
    </ToggleGroupItem>
  )
}

export default FilterTab
