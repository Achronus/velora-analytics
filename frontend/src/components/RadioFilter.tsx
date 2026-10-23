import { Capitalize, cn } from "@/lib/utils"
import { Button } from "./ui/button"

type RadioFilterProps = {
  className?: string
  filterItems: string[]
}

const RadioFilter = ({ className, filterItems }: RadioFilterProps) => {
  return (
    <div role="radiogroup" className={cn("flex flex-wrap gap-1", className)}>
      {filterItems.map((item) => (
        <Button
          key={item}
          role="radio"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "h-7 px-2.5 text-[13px] font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {Capitalize(item)}
        </Button>
      ))}
    </div>
  )
}

export default RadioFilter
