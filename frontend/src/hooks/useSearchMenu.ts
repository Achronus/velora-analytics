import { SearchMenuContext } from "@/contexts/SearchMenuContext"
import { useContext } from "react"

export const useSearchMenu = () => {
  const ctx = useContext(SearchMenuContext)

  if (!ctx)
    throw new Error(
      "'useSearchMenu' must be used inside '<SearchMenuProvider>'"
    )

  return ctx
}
