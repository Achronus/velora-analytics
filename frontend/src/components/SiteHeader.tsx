import LiveDot from "@/components/LiveDot"
import ScenarioCommandMenu from "@/components/ScenarioCommandMenu"
import { Route as CampaignsRoute } from "@/routes/campaigns"
import { Route as ConfigsRoute } from "@/routes/configs"
import { Route as DashboardsRoute } from "@/routes/dashboards/index"
import { Route as LiveRoute } from "@/routes/live"
import { Route as MonitoringRoute } from "@/routes/monitoring"
import { Route as PlaybackRoute } from "@/routes/playback"
import { Route as TelemetryRoute } from "@/routes/telemetry"
import { Link, linkOptions } from "@tanstack/react-router"

export const SiteHeader = ({ running = false }: { running?: boolean }) => {
  const navItems = linkOptions([
    { label: "Live", to: LiveRoute.to, live: true },
    { label: "Dashboards", to: DashboardsRoute.to, live: false },
    { label: "Telemetry", to: TelemetryRoute.to, live: false },
    { label: "Playback", to: PlaybackRoute.to, live: false },
    { label: "Campaigns", to: CampaignsRoute.to, live: false },
    { label: "Monitoring", to: MonitoringRoute.to, live: false },
    { label: "Configs", to: ConfigsRoute.to, live: false },
  ])

  return (
    <header className="sticky top-0 z-50 flex h-20 gap-5 border-b border-line px-4">
      <div className="my-4 flex shrink-0 items-center gap-5 border-r pr-5">
        <Link to="/">
          <img src="/icon-dark.png" alt="Logo" className="h-8 w-auto" />
        </Link>
        <ScenarioCommandMenu />
      </div>

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
            {link.live && <LiveDot active={running} />}
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
