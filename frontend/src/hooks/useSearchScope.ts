import type { ModuleFormat } from "@/lib/types"
import { useSearchMenu } from "./useSearchMenu"
import type { Crumb, SearchHit } from "@/lib/search/types"
import { useState } from "react"
import { toCrumb } from "@/lib/search/utils"
import type { ScopeCrumb } from "@/contexts/SearchMenuContext"
import { channelTarget, rowOf } from "@/lib/search/registry"
import { runColourClass } from "@/lib/utils"

const BREADCRUMB_LEVELS: ModuleFormat[] = [
  "mission",
  "campaign",
  "run",
  "episode",
]

const LIBRARY_ITEMS: ModuleFormat[] = ["agent", "environment"]

/**
 * "Where you are" logic for the search dialog. Decides what the header breadcrumb displays
 *
 * - `mission`: the chip in the search box. Starts as the breadcrumb's mission each time the menu
 *   opens. Removing it widens only this search.
 * - `attachMission(hit)`: ↵ on a mission. Sets the chip and moves the breadcrumb to that mission.
 * - `clearMission()`: × on the chip, or Backspace in an empty box.
 * - `moveBreadcrumbTo(hit)`: opening anything else.
 *  *     campaign / run / episode → its full chain:   mission / MC-031 / EV-0311 / CA-0419
 *     agent / environment      → mission + item:   mission / AG-07   (you've left the campaign chain)
 *     channel                  → keep the current location (it's data from the run you're on),
 *                                unless it belongs to another mission
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
    const here: ScopeCrumb = {
      ...toCrumb(hit),
      chip: rowOf(hit).chip?.className,
    }
    const hitMission = hit.path.find((c) => c.module === "mission")

    if (BREADCRUMB_LEVELS.includes(hit.module)) {
      const parents = hit.path.filter((c) =>
        BREADCRUMB_LEVELS.includes(c.module)
      )
      setScope([...parents, here])
      return
    }

    if (LIBRARY_ITEMS.includes(hit.module)) {
      setScope(hitMission ? [hitMission, here] : [here])
      return
    }

    if (hit.module === "channel") {
      const target = channelTarget(hit, { scope }).scope
      // keep existing crumbs (they carry their colour); colour a newly reached episode
      setScope(
        target.map((c, i) =>
          i === target.length - 1 && c.module === "episode" && !("chip" in c)
            ? { ...c, chip: runColourClass(c.id) }
            : c
        )
      )
      return
    }

    if (hitMission && hitMission.id !== scope[0]?.id) setScope([hitMission])
  }

  return { mission, attachMission, clearMission, moveBreadcrumbTo }
}
