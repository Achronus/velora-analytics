import { useSearchPreview } from "@/hooks/useSearchPreview"
import type { HitOf } from "@/lib/search/types"
import type { ID, ModuleFormat } from "@/lib/types"
import type { FC } from "react"

type Props = {
  module: ModuleFormat
  id: ID
}

export const preview =
  <M extends ModuleFormat>(): FC<{ hit: HitOf<M> }> =>
  ({ hit }) => <FactsPreview module={hit.module} id={hit.id} />

const FactsPreview = ({ module, id }: Props) => {
  const { data, isPending } = useSearchPreview(module, id)

  if (isPending) return <p className="text-xs text-mute">Loading...</p>
  if (!data) return null

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-line">
        {data.facts.map((f) => (
          <div key={f.k} className="bg-card px-3 py-2">
            <dt className="text-[11px] text-mute">{f.k}</dt>
            <dd className="mt-05 font-ibm text-[13px]">{f.v}</dd>
          </div>
        ))}
      </dl>
      {data.note && (
        <p className="text-xs text-muted-foreground">{data.note}</p>
      )}
    </div>
  )
}

export default FactsPreview
