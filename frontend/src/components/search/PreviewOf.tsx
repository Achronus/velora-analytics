import { getModuleSpec } from "@/lib/search/registry"
import type { SearchHit } from "@/lib/search/types"
import type { FC } from "react"

const PreviewOf: FC<{ hit: SearchHit }> = ({ hit }) => {
  const { Preview } = getModuleSpec(hit)
  return <Preview hit={hit} />
}

export default PreviewOf
