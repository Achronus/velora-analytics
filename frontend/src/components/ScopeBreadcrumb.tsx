import { useSearchMenu } from "@/hooks/useSearchMenu"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { Fragment } from "react"
import { Button } from "./ui/button"

const SEGMENT =
  "h-7.5 cursor-pointer gap-1.5 px-2 font-mono text-[12.5px] font-normal text-dim"

const ScopeBreadcrumb = () => {
  const { scope, openMenu } = useSearchMenu()

  if (scope.length === 0) {
    return (
      <Button
        variant="ghost"
        onClick={() => openMenu("", "all")}
        className={SEGMENT}
      >
        <span className="[text-box:trim-both_cap_alphabetic]">
          All missions
        </span>
        <ChevronDown className="size-3 text-mute" />
      </Button>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      {scope.map((crumb, i) => {
        const last = i === scope.length - 1

        return (
          <Fragment key={`${crumb.module}:${crumb.id}`}>
            {i > 0 && <span className="px-0.5 text-line-strong">/</span>}
            <Button
              variant="ghost"
              onClick={() => openMenu("", crumb.module)}
              aria-current={last ? "location" : undefined}
              title={crumb.name}
              className={cn(SEGMENT, last ? "text-text" : "text-dim")}
            >
              {last && crumb.chip && (
                <span className={cn("size-2 rounded-xs", crumb.chip)} />
              )}
              <span className="[text-box:trim-both_cap_alphabetic]">
                {crumb.id}
              </span>
              <ChevronDown className="size-3 text-mute" />
            </Button>
          </Fragment>
        )
      })}
    </nav>
  )
}

export default ScopeBreadcrumb
