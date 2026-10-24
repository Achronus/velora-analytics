import type { Crumb } from "@/lib/search/types"
import type { Filter } from "@/lib/types"
import { createContext } from "react"

export type ScopeCrumb = Crumb & { chip?: string }

export type SearchMenuContextValue = {
  open: boolean // Whether dialog is open
  query: string // Text in search box
  initialFilter: Filter // Tab dialog opens
  scope: ScopeCrumb[] // Header breadcrumb

  setOpen: (open: boolean) => void
  setQuery: (query: string) => void
  setScope: (scope: ScopeCrumb[]) => void

  openMenu: (initialQuery?: string, initialFilter?: Filter) => void
  closeMenu: () => void
}

export const SearchMenuContext = createContext<SearchMenuContextValue | null>(
  null
)
