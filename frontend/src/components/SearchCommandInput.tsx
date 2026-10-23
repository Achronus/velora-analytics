import { cn } from "@/lib/utils"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"
import { DialogClose } from "./ui/dialog"
import { InputGroup, InputGroupAddon } from "./ui/input-group"
import { Kbd } from "./ui/kbd"

const SearchCommandInput = ({
  className,
  onFocus,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) => {
  return (
    <div className="border-b px-2 py-2">
      <InputGroup className="h-10 border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-transparent">
        <InputGroupAddon>
          <SearchIcon className="size-4 opacity-50" />
        </InputGroupAddon>
        <CommandPrimitive.Input
          data-slot="input-group-control"
          onFocus={(e) => {
            const end = e.currentTarget.value.length
            e.currentTarget.setSelectionRange(end, end)
            onFocus?.(e)
          }}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-base outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <DialogClose
            aria-label="Close search"
            tabIndex={-1}
            className="cursor-pointer"
          >
            <Kbd className="border">esc</Kbd>
          </DialogClose>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default SearchCommandInput
