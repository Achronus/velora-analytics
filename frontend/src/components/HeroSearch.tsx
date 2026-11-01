import type { RecentLink } from "@/lib/types"
import { SearchBar } from "@velora/components/search"
import RecentLinks from "./RecentLinks"

type HeroProps = {
  recents: RecentLink[]
}

const HeroSearch = ({ recents }: HeroProps) => {
  return (
    <div className="flex flex-col items-center gap-3.5 py-2">
      {/* Title */}
      <div className="font-mono text-xs tracking-wider text-mute uppercase">
        Velora Analytics
      </div>
      <SearchBar
        size="lg"
        className="w-full max-w-180"
        placeholder="Search missions, campaigns, runs, channels..."
      />
      <RecentLinks caption="Recent" recentItems={recents} />
    </div>
  )
}

export default HeroSearch
