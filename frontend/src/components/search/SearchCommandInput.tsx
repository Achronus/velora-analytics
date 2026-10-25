import type { Crumb } from "@/lib/search/types"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon, X } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "../ui/input-group"

type Props = React.ComponentProps<typeof CommandPrimitive.Input> & {
  mission?: Crumb | null
  onClearMission?: () => void
}

const SearchCommandInput = ({
  className,
  onFocus,
  onKeyDown,
  autoFocus = true,
  value,
  onValueChange,
  mission,
  onClearMission,
  ...props
}: Props) => {
  return (
    <div className="border-b px-2 py-2">
      <InputGroup className="h-10 border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-transparent">
        <InputGroupAddon>
          <SearchIcon className="size-4 opacity-50" />
        </InputGroupAddon>

        {mission && (
          <InputGroupAddon className="pl-1">
            <div
              className="border-line-string flex items-center gap-1 rounded border py-0.5 pr-0.5 pl-2 font-mono text-xs text-dim"
              title={mission.name}
            >
              {mission.id}
              <button
                type="button"
                aria-label="Search all missions"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={onClearMission}
                className="cursor-pointer rounded p-0.5 hover:text-text"
              >
                <X className="size-3" />
              </button>
            </div>
          </InputGroupAddon>
        )}

        <CommandPrimitive.Input
          data-slot="input-group-control"
          autoFocus={autoFocus}
          value={value}
          onValueChange={onValueChange}
          onFocus={(e) => {
            const end = e.currentTarget.value.length
            e.currentTarget.setSelectionRange(end, end)
            onFocus?.(e)
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value && mission) onClearMission?.()
            onKeyDown?.(e)
          }}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-base outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onValueChange?.("")}
            className="cursor-pointer text-mute hover:text-text"
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default SearchCommandInput
