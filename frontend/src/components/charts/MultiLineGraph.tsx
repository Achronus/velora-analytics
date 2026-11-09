import type { Band, Line } from "@/lib/types"
import { cn } from "@/lib/utils"

type Props = {
  lines: Line[]
  bands?: Band[]
  width?: number
  height?: number
  className?: string
  children?: React.ReactNode
}

const BAND_FILL = { warn: "fill-warn/16", alarm: "fill-alarm/16" }

const MultiLineGraph = ({
  lines,
  bands,
  width = 300,
  height = 92,
  className,
  children,
}: Props) => {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block w-full", className)}
    >
      {bands?.map((b) => (
        <rect
          key={`${b.y}-${b.tone}`}
          x={0}
          y={b.y}
          width={width}
          height={b.h}
          className={BAND_FILL[b.tone]}
        />
      ))}
      {children}
      {lines.map((l, i) => (
        <polyline
          key={i}
          points={l.points}
          fill="none"
          strokeWidth={1.4}
          strokeLinejoin="round"
          strokeDasharray={l.dash ? "4.3" : undefined}
          vectorEffect="non-scaling-stroke"
          className={l.className}
        />
      ))}
    </svg>
  )
}

export default MultiLineGraph
