import type { Filter } from "@/lib/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { type ScopeCrumb, SearchMenuContext } from "./SearchMenuContext"

const SearchMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpenState] = useState(false)
  const [query, setQuery] = useState("")
  const [initialFilter, setInitialFilter] = useState<Filter>("all")
  const [scope, setScope] = useState<ScopeCrumb[]>([])

  const openMenu = useCallback(
    (initialQuery: string = "", filter: Filter = "all") => {
      setQuery(initialQuery)
      setInitialFilter(filter)
      setOpenState(true)
    },
    []
  )

  const closeMenu = useCallback(() => {
    setQuery("")
    setOpenState(false)
  }, [])

  const setOpen = useCallback(
    (next: boolean) => (next ? openMenu() : closeMenu()),
    [openMenu, closeMenu]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()

        if (open) closeMenu()
        else openMenu()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, openMenu, closeMenu])

  const value = useMemo(
    () => ({
      open,
      query,
      setQuery,
      initialFilter,
      openMenu,
      closeMenu,
      setOpen,
      scope,
      setScope,
    }),
    [open, query, initialFilter, openMenu, closeMenu, setOpen, scope]
  )

  return <SearchMenuContext value={value}>{children}</SearchMenuContext>
}

export default SearchMenuProvider
