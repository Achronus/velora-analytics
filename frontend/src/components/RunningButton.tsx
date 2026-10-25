import { useLiveStatus } from "@/hooks/useLiveStatus"
import type { LiveStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import LiveDot from "./LiveDot"
import { buttonVariants } from "./ui/button"

const STATUS_STYLE: Record<LiveStatus, string> = {
  running:
    "border-live/35 text-live-fg hover:text-live-fg dark:border-live/35 dark:hover:bg-live/10",
  idle: "text-text-mute hover:text-text dark:border-border",
  offline:
    "border-alarm/40 text-alarm-fg hover:text-alarm-fg dark:border-alarm/40 dark:hover:bg-alarm/10",
}

const RunningButton = () => {
  const { count, status, isPending } = useLiveStatus()

  const label =
    status === "offline"
      ? "offline"
      : isPending
        ? "- running"
        : `${count} running`
  const description =
    status === "offline"
      ? "Can't reach the server, so the running count is unavailable"
      : isPending
        ? "Checking for running jobs"
        : `${count} ${count === 1 ? "run" : "runs"} in progress`

  return (
    <Link
      to="/"
      hash="running"
      aria-label={description}
      title={status === "offline" ? description : undefined}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "h-7.5 gap-1.75 rounded-md px-2.5 font-mono text-xs font-normal shadow-none dark:bg-transparent",
        STATUS_STYLE[status]
      )}
    >
      <LiveDot status={status} />
      {label}
    </Link>
  )
}

export default RunningButton
