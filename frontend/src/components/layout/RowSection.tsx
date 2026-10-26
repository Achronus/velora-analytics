import { ROW_SIZE } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { createContext, useContext, useId, type ComponentProps } from "react"

type SectionVariant = "plain" | "boxed" | "panel" | "bar" | "viewport"

const SectionContext = createContext<{
  titleId?: string
  variant: SectionVariant
}>({ variant: "plain" })

const rowSectionVariants = cva("min-w-0", {
  variants: {
    size: ROW_SIZE,
    variant: {
      plain: "",
      boxed: "rounded-[10px] border border-border px-4 py-3.5",
      panel: "rounded-[10px] border border-border bg-panel px-4 py-3.5",
      bar: "overflow-hidden rounded-[10px] border border-border",
      viewport:
        "relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-[#0b0e12]",
    },
  },
  defaultVariants: { size: "full", variant: "plain" },
})

const HEADER: Record<SectionVariant, string> = {
  plain: "mb-2.5",
  boxed: "mb-3",
  panel: "mb-3",
  bar: "border-b border-border bg-panel px-4 py-2.75",
  viewport: "absolute inset-x-0 top-0 z-10 px-3.5 py-2.5", // floats over the view
}

const RowSection = ({
  className,
  size,
  variant,
  ...props
}: ComponentProps<"section"> & VariantProps<typeof rowSectionVariants>) => {
  const titleId = useId()

  return (
    <SectionContext value={{ titleId, variant: variant ?? "plain" }}>
      <section
        data-slot="row-section"
        data-variant={variant ?? "plain"}
        aria-labelledby={titleId}
        className={cn(rowSectionVariants({ size, variant }), className)}
        {...props}
      />
    </SectionContext>
  )
}

const RowSectionHeader = ({ className, ...props }: ComponentProps<"div">) => {
  const { variant } = useContext(SectionContext)

  return (
    <div
      data-slot="row-section-header"
      className={cn(
        "gap-x.2.5 gap-y.2 flex flex-wrap items-center justify-between",
        HEADER[variant],
        className
      )}
      {...props}
    />
  )
}

const RowSectionTitle = ({ className, ...props }: ComponentProps<"h2">) => {
  const { titleId } = useContext(SectionContext)

  return (
    <h2
      data-slot="row-section-title"
      id={titleId}
      className={cn(
        "inline-flex items-center gap-2 text-[13px] font-semibold",
        className
      )}
      {...props}
    />
  )
}

const RowSectionAction = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="row-section-action"
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-mute",
        className
      )}
      {...props}
    />
  )
}

const RowSectionContent = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="row-section-content"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

export {
  RowSection,
  RowSectionAction,
  RowSectionContent,
  RowSectionHeader,
  RowSectionTitle,
  rowSectionVariants,
  type SectionVariant,
}
