import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

const PageSidebar = ({ className, ...props }: ComponentProps<"aside">) => {
  return (
    <aside
      data-slot="page-sidebar"
      className={cn(
        "-mx-6 -mt-4.5 flex flex-col gap-4.5 border-b border-line px-3.5 py-5",
        "lg:absolute lg:inset-y-0 lg:left-0 lg:m-0 lg:w-(--page-sidebar-w) lg:overflow-y-auto lg:border-r lg:border-b-0",
        className
      )}
      {...props}
    />
  )
}

const PageSidebarGroup = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="page-sidebar-group"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

const PageSidebarHeading = ({
  className,
  count,
  children,
  ...props
}: ComponentProps<"div"> & { count?: number }) => {
  return (
    <div
      data-slot="page-sidebar-heading"
      className={cn(
        "flex items-center justify-between px-2 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-mute uppercase",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className="text-xs tracking-normal normal-case">{count}</span>
      )}
    </div>
  )
}

type ItemProps = {
  indicator?: boolean
}

const PageSidebarItemAnchor = ({
  className,
  indicator,
  ...props
}: ComponentProps<"a"> & ItemProps) => {
  return (
    <a
      data-slot="page-sidebar-item"
      className={cn(
        "group/item grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 rounded-lg px-2.5 py-2 text-left text-sm text-dim transition-colors",
        "hover:bg-muted/60 hover:text-text",
        "data-[status=active]:bg-muted data-[status=active]:text-text",
        indicator &&
          "data-[status=active]:shadow-[inset_2px_0_0_var(--color-text)]",
        className
      )}
      {...props}
    />
  )
}

const PageSidebarItemLabel = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      data-slot="page-sidebar-item-label"
      className={cn(
        "col-start-1 truncate group-has-data-[slot=page-sidebar-item-meta]/item:font-medium group-has-data-[slot=page-sidebar-item-meta]/item:text-text",
        className
      )}
      {...props}
    />
  )
}

const PageSidebarItemMeta = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      data-slot="page-sidebar-item-meta"
      className={cn(
        "col-start-1 mt-0.75 truncate text-xs text-mute",
        className
      )}
      {...props}
    />
  )
}

const PageSidebarItemCount = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      data-slot="page-sidebar-item-count"
      className={cn(
        "col-start-2 row-span-2 row-start-1 font-mono text-xs text-mute",
        className
      )}
      {...props}
    />
  )
}

export {
  PageSidebar,
  PageSidebarGroup,
  PageSidebarHeading,
  PageSidebarItemAnchor,
  PageSidebarItemCount,
  PageSidebarItemLabel,
  PageSidebarItemMeta,
}
