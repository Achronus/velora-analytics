import type { PreviewData } from "@/lib/search/types"

const W = 360
const H = 90

const Spark = ({ series }: { series: NonNullable<PreviewData["series"]> }) => {
  const { values, warn, limit, inverted } = series
  const hasBands = warn != null && limit != null

  let lo = Math.min(...values)
  let hi = Math.max(...values)

  // Stretch range so both threshold bands are always visible
  if (hasBands) {
    if (inverted) {
      lo = Math.min(lo, limit * 0.9)
      hi = Math.max(hi, warn * 1.1)
    } else {
      lo = Math.min(lo, warn * 0.9)
      hi = Math.max(hi, limit * 1.1)
    }
  }

  if (hi - lo < 1e-9) hi = lo + 1

  const y = (v: number) => H - 3 - ((v - lo) / (hi - lo)) * (H - 6)
  const points = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * W).toFixed(1)},${y(v).toFixed(1)}`
    )
    .join(" ")

  const band = (a: number, b: number) => {
    const top = Math.max(0, Math.min(a, b))
    return { y: top, h: Math.max(0, Math.min(H, Math.max(a, b)) - top) }
  }

  const bands = hasBands
    ? [
        { ...band(y(warn), y(limit)), className: "fill-warn/14" },
        {
          ...(inverted ? band(y(limit), H) : band(0, y(limit))),
          className: "fill-alarm/14",
        },
      ]
    : []

  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-mute">
        <span>{series.label}</span>
        <span className="font-mono">{series.value}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-22.5 w-full rounded-md border border-line bg-background"
        aria-hidden
      >
        {bands.map((b, i) => (
          <rect
            key={i}
            x={0}
            y={b.y}
            width={W}
            height={b.h}
            className={b.className}
          />
        ))}
        <polyline
          points={points}
          fill="none"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          className="stroke-data"
        />
      </svg>
    </div>
  )
}

export default Spark
