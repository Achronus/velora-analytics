import { cn, coverageClass } from "@/lib/utils"

const Coverage = ({ cells }: { cells: number[] }) => {
  return (
    <div>
      <div className="mb-1 text-[11px] text-mute">
        coverage · closing speed × detection range
      </div>
      <div
        className="grid w-45 grid-cols-10 gap-0.5"
        role="img"
        aria-label="Coverage map: success rate by closing speed and detection range"
      >
        {cells.map((p, i) => (
          <span
            key={i}
            className={cn("h-3.5 rounded-xs", coverageClass(p))}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default Coverage
