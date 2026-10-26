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

const PageSidebarLabel = ({
  className,
  count,
  children,
  ...props
}: ComponentProps<"div"> & { count?: number }) => {
  return (
    <div
      data-slot="page-sidebar-label"
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

export { PageSidebar, PageSidebarGroup, PageSidebarLabel }
