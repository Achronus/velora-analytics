import { useSearchPreview } from "@/hooks/useSearchPreview"
import { rowOf } from "@/lib/search/registry"
import type { SearchHit, Tone } from "@/lib/search/types"
import { cn } from "@/lib/utils"
import Coverage from "../charts/Coverage"
import Spark from "../charts/Spark"
import { Button } from "../ui/button"
import { Kbd } from "../ui/kbd"
import Chip from "./Chip"
import PreviewSkeleton from "./PreviewSkeleton"
import RowPill from "./RowPill"

const FACT_TONE: Record<Tone, string> = {
  nominal: "text-nominal-fg",
  warn: "text-warn-fg",
  alarm: "text-alarm-fg",
  live: "text-live-fg",
  model: "text-model",
  neutral: "text-text-dim",
}

type Props = {
  hit: SearchHit
  onOpen: (href: string) => void
}

const SearchPreview = ({ hit, onOpen }: Props) => {
  const row = rowOf(hit)
  const { data, isPending, isError } = useSearchPreview(hit.module, hit.id)

  return (
    <div className="flex h-full min-h-0 flex-col gap-3.5">
      {/* row 1: title */}
      <div className="flex flex-wrap items-center gap-2.5">
        {row.chip && <Chip chip={row.chip} className="size-3" />}
        <span className={cn("text-base text-text", row.mono && "font-mono")}>
          {row.title}
        </span>
        {row.pill && <RowPill pill={row.pill} />}
        <span className="rounded-border ml-auto border-line px-1.5 text-[11px] text-mute">
          {hit.module}
        </span>
      </div>

      {/* row 2: data */}
      {isPending && <PreviewSkeleton />}
      {isError && <p className="text-xs text-mute">Preview unavailable.</p>}

      {data && (
        <>
          {data.series && <Spark series={data.series} />}
          {data.coverage && <Coverage cells={data.coverage} />}

          {data.facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-line">
              {data.facts.map((f) => (
                <div key={f.k} className="bg-card px-3 py-2">
                  <dt className="text-[11px] text-mute">{f.k}</dt>
                  <dd
                    className={cn(
                      "mt-0.5 font-mono text-[13px] text-text",
                      f.tone && FACT_TONE[f.tone]
                    )}
                  >
                    {f.v}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {data.note && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {data.note}
            </p>
          )}

          {data.actions && data.actions.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5">
              {data.actions.map((a, i) => (
                <Button
                  key={a.label}
                  size="sm"
                  variant={i === 0 ? "default" : "outline"}
                  onClick={() => onOpen(a.href)}
                  className={cn(
                    "h-8 cursor-pointer gap-1.5 rounded-[7px] px-3 text-[13px]",
                    i === 0 ? "font-semibold" : "font-normal"
                  )}
                >
                  {a.label}
                  {a.key && (
                    <Kbd
                      className={cn(
                        "h-4.5 min-w-4.5 font-mono text-[11px]",
                        i === 0
                          ? "bg-primary-foreground/10 text-primary-foreground/70"
                          : ""
                      )}
                    >
                      {a.key}
                    </Kbd>
                  )}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchPreview
