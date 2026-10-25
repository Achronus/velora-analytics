import { useRunningCount } from "@/hooks/useRunningCount"
import type { LiveStatus } from "@/lib/types"

/**
 * The running count plus the status.
 *
 * Shares useRunningCount's single polled request, so every caller agrees.
 * While the first request is loading the status is "idle" (grey), never red.
 */
export const useLiveStatus = () => {
  const { data: count = 0, isPending, isError } = useRunningCount()
  const status: LiveStatus = isError
    ? "offline"
    : count > 0
      ? "running"
      : "idle"
  return { count, status, isPending }
}
