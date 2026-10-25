import LiveDot from "@/components/LiveDot"
import { NAV_ITEMS } from "@/lib/constants"

import { useSearchMenu } from "@/hooks/useSearchMenu"
import { Link } from "@tanstack/react-router"
import ScopeBreadcrumb from "./ScopeBreadcrumb"

export const SiteHeader = ({ running = false }: { running?: boolean }) => {
  const { setScope } = useSearchMenu()

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

      <nav aria-label="Primary" className="mt-1 flex">
        {NAV_ITEMS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="-mb-px flex items-center gap-2 border-b-2 px-3 text-lg transition-colors"
            activeProps={{
              className: "border-foreground text-foreground font-medium",
            }}
            inactiveProps={{
              className:
                "border-transparent text-neutral-500 hover:text-foreground",
            }}
          >
            {link.live && <LiveDot active={running} />}
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
