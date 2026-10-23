import { useSearchMenu } from "@/hooks/useSearchMenu"
import { Search } from "lucide-react"
import type { ChangeEvent } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Kbd } from "./ui/kbd"

type Props = {
  placeholder?: string
}

const HeroSearch = ({
  placeholder = "Search missions, campaigns, runs, channels...",
}: Props) => {
  const { query, setQuery, openMenu } = useSearchMenu()

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value

    if (next) openMenu(next)
    else setQuery(next)
  }

  return (
    <InputGroup className="h-13 w-full max-w-180 rounded-xl border-line-strong bg-panel shadow-none hover:border-mute has-[[data-slot=input-group-control]:focus-visible]:border-mute has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-panel">
      <InputGroupAddon className="pl-4.5">
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search"
        placeholder={placeholder}
        value={query}
        onChange={onChange}
        className="placeholder:text-text-mute text-[15px] md:text-[15px]"
      />
      <InputGroupAddon align="inline-end" className="pr-3.5">
        <Kbd className="h-auto rounded-[5px] border border-line-strong bg-transparent px-1.5 py-0.5 font-mono text-xs">
          CTRL + K
        </Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default HeroSearch
