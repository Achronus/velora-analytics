import { useSearchMenu } from "@/hooks/useSearchMenu"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Search } from "lucide-react"
import { useEffect, useRef, type ChangeEvent } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Kbd, KbdGroup } from "./ui/kbd"

const bar = cva(
  "hover:border-text-mute has-[[data-slot=input-group-control]:focus-visible]:border-text-mute border-line-strong bg-panel shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-panel",
  {
    variants: {
      size: {
        sm: "h-7.5 rounded-md border-border bg-transparent dark:bg-transparent",
        lg: "h-13 rounded-xl",
      },
    },
    defaultVariants: { size: "lg" },
  }
)

const PARTS = {
  sm: {
    start: "pl-2.5",
    icon: "size-3.25",
    input: "text-[12.5px] md:text-[12.5px]",
    end: "pr-1.5",
    kbd: "h-4.5 text-[11px]",
  },
  lg: {
    start: "pl-4.5",
    icon: "size-4",
    input: "text-[15px] md:text-[15px]",
    end: "pr-3.5",
    kbd: "h-5 text-xs",
  },
} as const

// ⌘ on Apple platforms, Ctrl elsewhere. (userAgentData isn't in every browser yet, so fall back to platform.)
const isApple = () => {
  if (typeof navigator === "undefined") return false
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  return /mac|iphone|ipad/i.test(
    nav.userAgentData?.platform ?? navigator.platform
  )
}

type Props = VariantProps<typeof bar> & {
  placeholder?: string
  className?: string
}

const SearchBar = ({
  placeholder = "Search missions, campaigns, runs, channels…",
  size = "lg",
  className,
}: Props) => {
  const { open, query, setQuery, openMenu } = useSearchMenu()
  const inputRef = useRef<HTMLInputElement>(null)
  const openedHere = useRef(false)
  const parts = PARTS[size ?? "lg"]

  // When a menu this box opened closes, take focus back (Radix sends it to <body> otherwise)
  useEffect(() => {
    if (!open && openedHere.current) {
      openedHere.current = false
      inputRef.current?.focus()
    }
  }, [open])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    if (next) {
      openedHere.current = true
      openMenu(next)
    } else setQuery(next)
  }

  return (
    <InputGroup className={cn(bar({ size }), className)}>
      <InputGroupAddon className={parts.start}>
        <Search className={cn(parts.icon, "text-muted-foreground")} />
      </InputGroupAddon>

      <InputGroupInput
        ref={inputRef}
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        placeholder={placeholder}
        value={query}
        onChange={onChange}
        className={cn(parts.input, "placeholder:text-text-mute")}
      />

      <InputGroupAddon align="inline-end" className={parts.end}>
        <KbdGroup>
          {(isApple() ? ["⌘", "K"] : ["Ctrl", "K"]).map((key) => (
            <Kbd
              key={key}
              className={cn(
                parts.kbd,
                "text-text-mute rounded-lg border border-line-strong bg-transparent px-1 font-mono"
              )}
            >
              {key}
            </Kbd>
          ))}
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default SearchBar
