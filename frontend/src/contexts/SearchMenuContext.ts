import { createContext } from "react"

export type SearchMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void

  query: string
  setQuery: (query: string) => void

  openMenu: (initialQuery?: string) => void
  closeMenu: () => void
}

export const SearchMenuContext = createContext<SearchMenuContextValue | null>(
  null
)
