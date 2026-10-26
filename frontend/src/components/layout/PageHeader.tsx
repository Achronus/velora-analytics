import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

const PageHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "gap-y-2.5. flex flex-wrap items-center gap-x-4.5",
        className
      )}
      {...props}
    />
  )
}

const PageHeaderTitle = ({ className, ...props }: ComponentProps<"h1">) => {
  return (
    <h1
      data-slot="page-header-title"
      className={cn(
        "inline-flex items-center gap-2.25 font-mono text-xl font-normal",
        className
      )}
      {...props}
    />
  )
}

const PageHeaderMeta = ({ className, ...props }: ComponentProps<"span">) => {
  return (
    <span
      data-slot="page-header-meta"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

const PageHeaderActions = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("ml-auto flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

const PageHeaderDescription = ({
  className,
  ...props
}: ComponentProps<"p">) => {
  return (
    <p
      data-slot="page-header-description"
      className={cn(
        "basis-full text-[13.5px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderTitle,
}
