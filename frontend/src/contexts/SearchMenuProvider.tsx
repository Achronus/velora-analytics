import { useCallback, useEffect, useMemo, useState } from "react"
import { SearchMenuContext } from "./SearchMenuContext"

const SearchMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpenState] = useState(false)
  const [query, setQuery] = useState("")

  const openMenu = useCallback((initialQuery: string = "") => {
    setQuery(initialQuery)
    setOpenState(true)
  }, [])

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
    () => ({ open, query, setQuery, openMenu, closeMenu, setOpen }),
    [open, query, openMenu, closeMenu, setOpen]
  )

  return <SearchMenuContext value={value}>{children}</SearchMenuContext>
}

export default SearchMenuProvider
