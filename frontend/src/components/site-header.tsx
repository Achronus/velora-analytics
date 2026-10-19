import { cn } from "@/lib/utils"
import { Route as DashboardsRoute } from "@/routes/dashboards/index"
import { Route as LiveRoute } from "@/routes/live"
import { Route as PlaybackRoute } from "@/routes/playback"
import { Route as TelemetryRoute } from "@/routes/telemetry"
import { Link, linkOptions } from "@tanstack/react-router"

const LiveDot = ({ running }: { running: boolean }) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        running ? "bg-live-on motion-safe:animate-live" : "bg-live-off"
      )}
    />
  )
}

export const SiteHeader = ({ running = false }: { running?: boolean }) => {
  const navItems = linkOptions([
    { label: "Live", to: LiveRoute.to, live: true },
    { label: "Dashboards", to: DashboardsRoute.to, live: false },
    { label: "Telemetry", to: TelemetryRoute.to, live: false },
    { label: "Playback", to: PlaybackRoute.to, live: false },
  ])

  return (
    <header className="sticky top-0 z-50 flex h-20 gap-5 border-b border-line px-4">
      <Link to="/" className="flex shrink-0 items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </Link>

      <nav aria-label="Primary" className="mt-1 flex">
        {navItems.map((link) => (
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
            {link.live && <LiveDot running={running} />}
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
