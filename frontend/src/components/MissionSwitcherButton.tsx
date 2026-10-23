import { useSearchMenu } from "@/hooks/useSearchMenu"
import { ChevronDown } from "lucide-react"
import { Button } from "./ui/button"

type Props = {
  currentMission?: string | null
}

const MissionSwitcherButton = ({ currentMission = null }: Props) => {
  const { openMenu } = useSearchMenu()

  return (
    <Button
      variant="ghost"
      onClick={() => openMenu()}
      className="mt-1 w-fit cursor-pointer font-ibm text-neutral-300"
    >
      {currentMission ?? "All missions"}
      <ChevronDown />
    </Button>
  )
}

export default MissionSwitcherButton
