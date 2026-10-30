import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"

type Bands = {
  y: number
  h: number
  className: string
}

type Props = {
  points: number[]
  progress?: number
  width?: number
  height?: number
  label?: string
  value?: string
  bands?: Bands[]
  warn_limit?: number
  danger_limit?: number
  inverted?: boolean
  className?: string
  lineClassName?: string
}

const LineGraph = ({
  points,
  progress,
  width = 360,
  height = 90,
  label,
  value,
  bands,
  warn_limit,
  danger_limit,
  inverted,
  className,
  lineClassName,
}: Props) => {
  let newBands: Bands[] = bands ?? []

  const hasBands = bands == null && warn_limit != null && danger_limit != null

  let lo = Math.min(...points)
  let hi = Math.max(...points)

  // Stretch range so both threshold bands are always visible
  if (hasBands) {
    if (inverted) {
      lo = Math.min(lo, danger_limit * 0.9)
      hi = Math.max(hi, warn_limit * 1.1)
    } else {
      lo = Math.min(lo, warn_limit * 0.9)
      hi = Math.max(hi, danger_limit * 1.1)
    }
  }

  if (hi - lo < 1e-9) hi = lo + 1

  const y = (v: number) => height - 3 - ((v - lo) / (hi - lo)) * (height - 6)

  // Handle progress size
  const pct = Math.min(Math.max(progress ?? 100, 0), 100)
  const span = width * (pct / 100)
  const step = points.length > 1 ? span / (points.length - 1) : 0

  // Update points depending on value provided
  const pointsData = points
    .map((v, i) => `${(i * step).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ")

  if (hasBands) {
    const band = (a: number, b: number) => {
      const top = Math.max(0, Math.min(a, b))
      return { y: top, h: Math.max(0, Math.min(height, Math.max(a, b)) - top) }
    }

    newBands = [
      { ...band(y(warn_limit), y(danger_limit)), className: "fill-warn/14" },
      {
        ...(inverted
          ? band(y(danger_limit), height)
          : band(0, y(danger_limit))),
        className: "fill-alarm/14",
      },
    ]
  }

  return (
    <>
      <div>
        {(label || value) && (
          <div className="mb-1 flex justify-between text-[11px] text-mute">
            {label && <span>{label}</span>}
            {value && <span className="font-mono">{value}</span>}
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className={cn("block w-full", className)}
          aria-hidden
        >
          {newBands?.map((b, i) => (
            <rect
              key={i}
              x={0}
              y={b.y}
              width={width}
              height={b.h}
              className={b.className}
            />
          ))}
          <polyline
            points={pointsData}
            fill="none"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
            className={cn("stroke-data", lineClassName)}
          />
        </svg>
      </div>

      {progress && (
        <Progress
          value={pct}
          className="**:data-[slot=progress-indicator]:bg-live"
        />
      )}
    </>
  )
}

export default LineGraph
