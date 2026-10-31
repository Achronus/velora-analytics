import { useLiveStatus } from "@/hooks/search/useLiveStatus"
import { createLink } from "@tanstack/react-router"
import { LiveStatusAnchor } from "@velora/components"

const LiveStatusLink = createLink(LiveStatusAnchor)

export const IsRunningButton = () => {
  const { count, status, isPending } = useLiveStatus()

  return (
    <LiveStatusLink
      to="/"
      hash="running"
      count={count}
      status={status}
      isPending={isPending}
    />
  )
}
