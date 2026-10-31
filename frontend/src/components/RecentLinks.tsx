import type { RecentLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { badgeVariants } from "./ui/badge"

type Props = {
  caption: string
  recentItems: RecentLink[]
}

const RecentLinks = ({ caption, recentItems }: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-mute">
      {caption}
      {recentItems.map((q) => (
        <Link
          key={q.id}
          to={q.to}
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
  )
}

export default RecentLinks
