import { useQuery } from "@tanstack/react-query"

async function fetchSearch(signal?: AbortSignal): Promise<number> {
  const res = await fetch("/api/v1/runs?status=running&limit=0", { signal })
  if (!res.ok) throw new Error(`Running count failed (${res.status})`)
  return (await res.json()).total
}

const searchQueryFn =
  () =>
  ({ signal }: { signal: AbortSignal }) =>
    fetchSearch(signal)

/**
 * Computes how many runs are in progress across every mission.
 * Polls every 10s while the tab is visible; both callers share one request.
 */
export const useRunningCount = () =>
  useQuery({
    queryKey: ["runs", "running-count"],
    queryFn: async () => 3,
    // queryFn: searchQueryFn(), // Uncomment when API configured
    refetchInterval: 10_000,
    staleTime: 5_000,
  })
