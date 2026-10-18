import { SiteHeader } from "@/components/site-header"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  )
}
