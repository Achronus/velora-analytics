import { getModuleSpec } from "@/lib/registry"
import type { SearchHit } from "@velora/components"
import type { FC } from "react"

const PreviewOf: FC<{ hit: SearchHit }> = ({ hit }) => {
  const { Preview } = getModuleSpec(hit)
  return <Preview hit={hit} />
}

export default PreviewOf
