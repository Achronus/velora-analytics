import { cn } from "@/lib/utils"
import { createLink } from "@tanstack/react-router"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

type TileAnchorProps = ComponentProps<"a"> & { variant?: "panel" | "ghost" }

const tileVariants = cva("min-w-0 rounded-[10px] border border-border", {
  variants: {
    variant: {
      panel: "flex flex-col gap-2.5 bg-panel px-4 py-3.5",
      ghost: "flex flex-col gap-1.5 px-4 py-3.5",
      list: "overflow-hidden [&>*+*]:border-t [&>*+*]:border-line-soft",
    },
    interactive: {
      true: "transition-colors hover:border-line-strong",
      false: "",
    },
  },
  defaultVariants: { variant: "panel", interactive: false },
})

const Tile = ({
  className,
  variant,
  interactive,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof tileVariants>) => {
  return (
    <div
      data-slot="tile"
      data-variant={variant}
      className={cn(tileVariants({ variant, interactive }), className)}
      {...props}
    />
  )
}

const TileAnchor = ({
  className,
  variant = "panel",
  ...props
}: TileAnchorProps) => {
  return (
    <a
      data-slot="tile"
      data-variant={variant}
      className={cn(tileVariants({ variant, interactive: true }), className)}
      {...props}
    />
  )
}

const TileLink = createLink(TileAnchor)

const TileGrid = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="tile-grid"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3",
        className
      )}
      {...props}
    />
  )
}

export { Tile, TileGrid, TileLink, tileVariants }
