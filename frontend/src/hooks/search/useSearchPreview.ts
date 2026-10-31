import { previewMock } from "@/lib/data/search"
import type { PreviewData } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import type { ID, ModuleFormat } from "@velora/components"

async function fetchSearch(module: ModuleFormat, id: ID): Promise<PreviewData> {
  const r = await fetch(
    `/api/v1/search/preview/${module}/${encodeURIComponent(id)}`
  )
  if (!r.ok) throw new Error("Preview failed")
  return r.json()
}

const searchQueryFn = (module: ModuleFormat, id: ID) => () =>
  fetchSearch(module, id)

export const useSearchPreview = (module: ModuleFormat, id: ID) =>
  useQuery({
    queryKey: ["search-preview", module, id],
    // queryFn: searchQueryFn(module, id),  // Uncomment when API configured
    queryFn: () => previewMock(module, id),
    staleTime: 30_000,
  })
