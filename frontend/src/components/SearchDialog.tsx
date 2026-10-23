import { useSearchMenu } from "@/hooks/useSearchMenu"
import { COMMAND_GROUP_DATA, COMMAND_MENU_FILTER_NAMES } from "@/lib/constants"
import { useRef } from "react"
import PreviewPane from "./PreviewPane"
import RadioFilter from "./RadioFilter"
import SearchCommandInput from "./SearchCommandInput"
import StatusPill from "./StatusPill"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Kbd } from "./ui/kbd"

const SearchDialog = () => {
  const { open, setOpen, query, setQuery } = useSearchMenu()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        initialFocus={inputRef}
        className="top-16 w-[min(1040px,calc(100%-2rem))] max-w-none! translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-none!"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search missions, campaigns, runs and channels
          </DialogDescription>
        </DialogHeader>

        <Command className="bg-card">
          {/* row 1: input */}
          <SearchCommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder="Search missions, campaigns, runs, channels..."
          />

          {/* row 2: filter */}
          <RadioFilter
            className="border-b px-3 py-2"
            filterItems={COMMAND_MENU_FILTER_NAMES}
          />

          {/* body: list + preview (2 cols) */}
          <div className="flex min-h-130">
            <CommandList className="max-h-150 flex-[1.45] border-r py-1.5">
              <CommandEmpty>
                {query ? `No results for "${query}"` : "Nothing created yet."}
              </CommandEmpty>
              {COMMAND_GROUP_DATA.map((group) => (
                <CommandGroup
                  key={group.id}
                  heading={group.heading}
                  className="**:[[cmdk-group-heading]]:tracking-widest"
                >
                  <CommandItem className="gap-2.5 rounded-md px-2.5 py-1.5">
                    <div></div>
                    <div></div>
                    <StatusPill status={"running"} />
                  </CommandItem>
                  <CommandItem className="gap-2.5 rounded-md px-2.5 py-1.5">
                    Search Emoji
                  </CommandItem>
                  <CommandItem className="gap-2.5 rounded-md px-2.5 py-1.5">
                    Calculator
                  </CommandItem>
                </CommandGroup>
              ))}
            </CommandList>

            <div className="flex-1 bg-background p-5 md:block">
              <PreviewPane />
            </div>
          </div>

          {/* footer */}
          <div className="text-text-mute flex flex-wrap items-center gap-2 border-t px-4 py-2 text-xs">
            <div className="ml-auto flex items-center gap-3 font-ibm text-[11px]">
              <Kbd>↑↓</Kbd> move
              <Kbd>↵</Kbd> open
              <Kbd>⌘↵</Kbd> new tab
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog
