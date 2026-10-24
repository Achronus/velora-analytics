import useDebouncedValue from "@/hooks/useDebouncedValue"
import { useSearchMenu } from "@/hooks/useSearchMenu"
import useSearchResults from "@/hooks/useSearchResults"
import {
  hitKey,
  hrefOf,
  MODULE_ORDER,
  MODULE_REGISTRY,
  rowOf,
} from "@/lib/search/registry"
import type { SearchHit } from "@/lib/search/types"
import type { Filter, ModuleFormat } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import FilterTab from "./search/FilterTab"
import HitRow from "./search/HitRow"
import PreviewHeader from "./search/PreviewHeader"
import PreviewOf from "./search/PreviewOf"
import SearchCommandInput from "./search/SearchCommandInput"
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
import { ToggleGroup } from "./ui/toggle-group"

const isModule = (key: string): key is ModuleFormat =>
  (MODULE_ORDER as string[]).includes(key)

const keepKeysLocal = (e: React.KeyboardEvent) => {
  if (
    e.key === "Enter" ||
    e.key === "Home" ||
    e.key === "End" ||
    e.key.startsWith("Arrow")
  )
    e.stopPropagation()
}

const SearchPanel = () => {
  const { query, setQuery, closeMenu } = useSearchMenu()
  const navigate = useNavigate()

  const [filter, setFilter] = useState<Filter>("all")
  const [active, setActive] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const q = useDebouncedValue(query.trim(), 120)
  const { data, isPending, isError, isFetching } = useSearchResults(q, filter)

  const groups = useMemo(() => data?.groups ?? [], [data])
  const counts = data?.counts ?? {}
  const total = MODULE_ORDER.reduce((n, m) => n + (counts[m] ?? 0), 0)

  const hitsByKey = useMemo(
    () =>
      new Map(
        groups.flatMap((g) => g.hits.map((h) => [hitKey(g.key, h), h] as const))
      ),
    [groups]
  )

  const activeHit = hitsByKey.get(active)

  const openHit = (hit: SearchHit, newTab = false) => {
    const href = hrefOf(hit)

    if (newTab) {
      window.open(href, "_blank", "noopener")
      return
    }

    closeMenu()
    navigate({ href })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && activeHit) {
      e.preventDefault()
      openHit(activeHit, true)
    }
  }

  const emptyMessage = isError ? (
    "Search is unavailable right now."
  ) : isPending ? (
    <span className="inline-flex items-center gap-1.5">
      <LoaderCircle className="size-3 animate-spin" />
      Searching...
    </span>
  ) : q ? (
    `No results for "${q}"${filter === "all" ? "" : ` in ${MODULE_REGISTRY[filter].label.toLowerCase()}`}`
  ) : (
    "Nothing created yet."
  )

  return (
    <Command
      shouldFilter={false}
      loop
      value={active}
      onValueChange={setActive}
      onKeyDown={onKeyDown}
      className="rounded-none bg-card"
    >
      {/* row 1: input */}
      <SearchCommandInput
        ref={inputRef}
        value={query}
        onValueChange={setQuery}
        placeholder="Search missions, campaigns, runs, channels..."
      />

      {/* row 2: filter */}
      <ToggleGroup
        value={[filter]}
        onValueChange={(v) => {
          const next = v[0] as Filter | undefined
          if (!next) return

          setFilter(next)
          inputRef.current?.focus()
        }}
        onKeyDown={keepKeysLocal}
        orientation="horizontal"
        aria-label="Filter results"
        className="w-full flex-wrap justify-start gap-1 border-b px-3 py-2"
      >
        <FilterTab value="all" label="All" count={data ? total : undefined} />
        {MODULE_ORDER.map((m) => (
          <FilterTab
            key={m}
            value={m}
            label={MODULE_REGISTRY[m].label}
            count={data ? (counts[m] ?? 0) : undefined}
          />
        ))}
      </ToggleGroup>

      {/* body: results | preview */}
      <div className="flex min-h-130">
        <CommandList
          className={cn(
            "max-h-150 flex-[1.45] border-r py-1.5 transition-opacity",
            isFetching && "opacity-70"
          )}
        >
          <CommandEmpty className="tm-sm py-10 text-center text-muted-foreground">
            {emptyMessage}
          </CommandEmpty>

          {groups.map((group) => {
            const module = isModule(group.key) ? group.key : null
            const groupTotal = module ? (counts[module] ?? 0) : 0
            const hidden =
              filter === "all" && module ? groupTotal - group.hits.length : 0

            return (
              <CommandGroup
                key={group.key}
                heading={
                  <span className="flex justify-between">
                    {group.heading}
                    {module && (
                      <span className="font-mono normal-case">
                        {groupTotal}
                      </span>
                    )}
                  </span>
                }
                className="**:[[cmdk-group-heading]]:text-text-mute px-1.5 **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:tracking-widest"
              >
                {group.hits.map((hit) => (
                  <CommandItem
                    key={hitKey(group.key, hit)}
                    value={hitKey(group.key, hit)}
                    onSelect={() => openHit(hit)}
                    className="gap-2.5 rounded-md px-2.5 py-1.5"
                  >
                    <HitRow row={rowOf(hit)} />
                  </CommandItem>
                ))}

                {/* Handle "All" tab */}
                {module && hidden > 0 && (
                  <CommandItem
                    value={`${group.key}:show-all`}
                    onSelect={() => setFilter(module)}
                    className="gap-2 rounded-md px-2.5 py-1.5 text-xs text-nominal-fg"
                  >
                    Show all {groupTotal}{" "}
                    {MODULE_REGISTRY[module].label.toLowerCase()}
                    <ArrowRight className="size-3" />
                  </CommandItem>
                )}
              </CommandGroup>
            )
          })}
        </CommandList>

        <aside
          className="hidden min-w-0 flex-1 flex-col gap-4 bg-background p-5 md:flex"
          aria-live="polite"
          onKeyDown={keepKeysLocal}
        >
          {activeHit ? (
            <>
              <PreviewHeader
                row={rowOf(activeHit)}
                onOpen={() => openHit(activeHit)}
              />
              <PreviewOf
                key={`${activeHit.module}:${activeHit.id}`}
                hit={activeHit}
              />
            </>
          ) : (
            <p className="text-sm text-mute">
              Highlight a result to preview it.
            </p>
          )}
        </aside>
      </div>

      {/* footer */}
      <div className="flex flex-wrap items-center gap-2 border-t px-4 py-2 text-xs text-mute">
        <div className="ml-auto flex items-center gap-3 font-mono text-[11px]">
          <Kbd>↑↓</Kbd> move
          <Kbd>↵</Kbd> open
          <Kbd>⌘↵</Kbd> new tab
          <Kbd>esc</Kbd> close
        </div>
      </div>
    </Command>
  )
}

const SearchDialog = () => {
  const { open, setOpen } = useSearchMenu()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-16 w-[min(1040px,calc(100%-2rem))] max-w-none! translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-none!"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search missions, campaigns, runs, agents, environments, episodes,
            and channels
          </DialogDescription>
        </DialogHeader>

        <SearchPanel />
      </DialogContent>
    </Dialog>
  )
}

export default SearchDialog
