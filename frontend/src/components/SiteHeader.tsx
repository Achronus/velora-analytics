import LiveDot from "@/components/LiveDot"
import { NAV_ITEMS } from "@/lib/constants"

import { useLiveStatus } from "@/hooks/useLiveStatus"
import { useSearchMenu } from "@/hooks/useSearchMenu"
import { Link } from "@tanstack/react-router"
import RunningButton from "./RunningButton"
import ScopeBreadcrumb from "./ScopeBreadcrumb"
import SearchBar from "./SearchBar"

export const SiteHeader = () => {
  const { setScope } = useSearchMenu()
  const { status } = useLiveStatus()

  return (
    <header className="sticky top-0 z-50 flex h-20 gap-5 border-b border-line px-4">
      <div className="my-4 flex shrink-0 items-center gap-5 border-r pr-5">
        <Link
          to="/"
          onClick={() => setScope([])}
          aria-label="Velora Analytics home"
        >
          <img src="/icon-dark.png" alt="Home" className="h-8 w-auto" />
        </Link>
        <ScopeBreadcrumb />
      </div>

      <nav aria-label="Primary" className="flex flex-wrap">
        {NAV_ITEMS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="-mb-px inline-flex items-center gap-1.75 border-b-2 px-3 transition-colors"
            activeProps={{
              className: "border-text text-text font-medium",
            }}
            inactiveProps={{
              className:
                "border-transparent text-muted-foreground hover:text-text",
            }}
          >
            {link.live && <LiveDot status={status} />}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2 py-2">
        <SearchBar size="sm" placeholder="Search" className="w-46" />
        <RunningButton />
      </div>
    </header>
  )
}
