import useDebouncedValue from "@/hooks/useDebouncedValue"
import { useSearchMenu } from "@/hooks/useSearchMenu"
import useSearchResults from "@/hooks/useSearchResults"
import { useSearchScope } from "@/hooks/useSearchScope"
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
import { useLocation, useNavigate } from "@tanstack/react-router"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import FilterTab from "./search/FilterTab"
import HitRow from "./search/HitRow"
import SearchCommandInput from "./search/SearchCommandInput"
import SearchPreview from "./search/SearchPreview"
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

const isFilter = (v: string | undefined): v is Filter =>
  v === "all" || (v !== undefined && isModule(v))

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
  const { query, setQuery, closeMenu, initialFilter, scope } = useSearchMenu()
  const { mission, attachMission, clearMission, moveBreadcrumbTo } =
    useSearchScope()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [active, setActive] = useState("")

  const plotted = useLocation({
    select: (l) =>
      String((l.search as Record<string, unknown>).plot ?? "")
        .split(",")
        .filter(Boolean),
  })
  const hrefCtx = { scope, plotted }

  const q = useDebouncedValue(query.trim(), 120)
  const { data, isPending, isError, isFetching } = useSearchResults(
    q,
    filter,
    mission?.id ?? null
  )

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

  const [shownGroups, setShownGroups] = useState(groups)
  if (groups !== shownGroups) {
    setShownGroups(groups)

    if (!hitsByKey.has(active)) {
      const first = groups.find((g) => g.hits.length > 0)
      setActive(first ? hitKey(first.key, first.hits[0]) : "")
    }
  }

  const focusInput = () => inputRef.current?.focus()

  const selectFilter = (next: Filter) => {
    setFilter(next)
    focusInput()
  }

  /** ↵ on a mission: attach it as the chip and start a fresh search inside it (menu stays open). */
  const searchInMission = (hit: SearchHit) => {
    attachMission(hit)
    setQuery("")
    setFilter("all")
    focusInput()
  }

  /** ↵ on anything else (or a preview action): go there, and the breadcrumb follows. */
  const go = (hit: SearchHit, href = hrefOf(hit, hrefCtx)) => {
    moveBreadcrumbTo(hit)
    closeMenu()
    navigate({ href })
  }

  const selectHit = (hit: SearchHit) =>
    hit.module === "mission" ? searchInMission(hit) : go(hit)

  // Ctrl+↵ opens the highlighted hit in a new tab.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && activeHit) {
      e.preventDefault()
      window.open(hrefOf(activeHit, hrefCtx), "_blank", "noopener")
    }
  }

  const where = [
    filter === "all" ? "" : MODULE_REGISTRY[filter].label.toLowerCase(),
    mission?.id,
  ]
    .filter(Boolean)
    .join(" · ")

  const emptyMessage = isError ? (
    "Search is unavailable right now."
  ) : isPending ? (
    <span className="inline-flex items-center gap-1.5">
      <LoaderCircle className="size-3 animate-spin" />
      Searching...
    </span>
  ) : q ? (
    `No results for "${q}"${where ? ` in ${where}` : ""}`
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
        mission={mission}
        onClearMission={clearMission}
        placeholder={
          mission
            ? "Search this mission..."
            : "Search missions, campaigns, runs, channels..."
        }
      />

      {/* row 2: filter */}
      <ToggleGroup
        value={[filter]}
        onValueChange={(pressed) => {
          const next = pressed[0]
          if (isFilter(next)) selectFilter(next)
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
                className="px-1.5 **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:tracking-widest **:[[cmdk-group-heading]]:text-mute"
              >
                {group.hits.map((hit) => (
                  <CommandItem
                    key={hitKey(group.key, hit)}
                    value={hitKey(group.key, hit)}
                    onSelect={() => selectHit(hit)}
                    className="group cursor-pointer gap-2.5 rounded-md px-2.5 py-1.5"
                  >
                    <HitRow row={rowOf(hit)} />
                    <Kbd className="invisible font-mono text-[11px] group-data-[selected=true]:visible">
                      ↵
                    </Kbd>
                  </CommandItem>
                ))}

                {/* Handle "All" tab */}
                {module && hidden > 0 && (
                  <CommandItem
                    value={`${group.key}:show-all`}
                    onSelect={() => selectFilter(module)}
                    className="cursor-pointer gap-2 rounded-md px-2.5 py-1.5 text-xs text-nominal-fg"
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
            <SearchPreview
              key={`${activeHit.module}:${activeHit.id}`}
              hit={activeHit}
              onOpen={(href) => go(activeHit, href)}
            />
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
