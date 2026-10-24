import { searchMock } from "@/lib/data"
import type { SearchResponse } from "@/lib/search/types"
import type { Filter } from "@/lib/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

async function fetchSearch(
  q: string,
  filter: Filter,
  mission: string | null,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q })

  if (filter !== "all") params.set("module", filter)
  if (mission) params.set("mission", mission)

  const res = await fetch(`/api/v1/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  return res.json()
}

const searchQueryFn =
  (q: string, filter: Filter, mission: string | null) =>
  ({ signal }: { signal: AbortSignal }) =>
    fetchSearch(q, filter, mission, signal)

/**
 * GET /api/v1/search?q=…&module=…  →  SearchResponse
 * An empty q should return recent/pinned groups, so the menu is useful before typing.
 * Previous results stay on screen while the next ones load (no flicker per keystroke).
 */
const useSearchResults = (q: string, filter: Filter, mission: string | null) =>
  useQuery({
    queryKey: ["search", q, filter, mission],
    // queryFn: searchQueryFn(q, filter, mission), // Uncomment when API configured
    queryFn: () => searchMock(q, filter, mission),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

export default useSearchResults
