import type { ModuleFormat } from "@/lib/types"
import { useSearchMenu } from "./useSearchMenu"
import type { Crumb, SearchHit } from "@/lib/search/types"
import { useState } from "react"
import { toCrumb } from "@/lib/search/utils"
import type { ScopeCrumb } from "@/contexts/SearchMenuContext"
import { rowOf } from "@/lib/search/registry"

const BREADCRUMB_LEVELS: ModuleFormat[] = [
  "mission",
  "campaign",
  "run",
  "episode",
]

/**
 * "Where you are" logic for the search dialog. Decides what the header breadcrumb displays
 *
 * - `mission`: the chip in the search box. Starts as the breadcrumb's mission each time the menu
 *   opens. Removing it widens only this search.
 * - `attachMission(hit)`: ↵ on a mission. Sets the chip and moves the breadcrumb to that mission.
 * - `clearMission()`: × on the chip, or Backspace in an empty box.
 * - `moveBreadcrumbTo(hit)`: opening anything else. Campaigns, runs and episodes become the new location
 */
export const useSearchScope = () => {
  const { scope, setScope } = useSearchMenu()
  const [mission, setMission] = useState<Crumb | null>(
    scope[0]?.module === "mission" ? scope[0] : null
  )

  const attachMission = (hit: SearchHit) => {
    const crumb = toCrumb(hit)
    setMission(crumb)
    setScope([crumb])
  }

  const clearMission = () => {
    setMission(null)
    setScope([])
  }

  const moveBreadcrumbTo = (hit: SearchHit) => {
    if (BREADCRUMB_LEVELS.includes(hit.module)) {
      const parents = hit.path.filter((c) =>
        BREADCRUMB_LEVELS.includes(c.module)
      )
      const here: ScopeCrumb = {
        ...toCrumb(hit),
        chip: rowOf(hit).chip?.className,
      }
      setScope([...parents, here])
      return
    }

    const hitMission = hit.path[0]
    if (hitMission && hitMission.id !== scope[0]?.id) setScope([hitMission])
  }

  return { mission, attachMission, clearMission, moveBreadcrumbTo }
}
