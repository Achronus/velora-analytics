import { Link } from "@tanstack/react-router"
import HeroSearch from "./HeroSearch"
import { Badge } from "./ui/badge"

type Recents = {
  id: string
  colour: string
}

type HeroProps = {
  recents: Recents[]
}

const Hero = ({ recents }: HeroProps) => {
  return (
    <div className="flex flex-col items-center gap-3.5 py-2">
      {/* Title */}
      <div className="font-mono text-xs tracking-wider text-mute uppercase">
        Velora Analytics
      </div>

      {/* Search bar */}
      <HeroSearch />

      {/* Recent items */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-mute">
        Recent
        {recents.map((q) => (
          <Badge
            key={q.id}
            variant="outline"
            className="gap-1.5 rounded-full px-2.5 py-1 font-mono font-normal text-dim hover:text-text"
          >
            <Link to="/playback">
              <span
                className={`inline-block size-1.75! gap-5 rounded-xs ${q.colour} mr-2`}
              />
              {q.id}
            </Link>
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default Hero
