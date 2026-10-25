import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import SearchBar from "./SearchBar"
import { badgeVariants } from "./ui/badge"

type Recents = {
  id: string
  chip: string
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
      <SearchBar size="lg" className="w-full max-w-180" />

      {/* Recent items */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-mute">
        Recent
        {recents.map((q) => (
          <Link
            key={q.id}
            to="/playback"
            className={cn(
              badgeVariants({ variant: "outline" }),
              "text-text-dim gap-1.5 rounded-full px-2.5 py-1 font-mono font-normal hover:text-text"
            )}
          >
            <span className={cn("size-1.75 rounded-xs", q.chip)} />
            {q.id}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Hero
