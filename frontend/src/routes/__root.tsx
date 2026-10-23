import SearchDialog from "@/components/SearchDialog"
import { SiteHeader } from "@/components/SiteHeader"
import SearchMenuProvider from "@/contexts/SearchMenuProvider"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <SearchMenuProvider>
        <SiteHeader />
        <Outlet />
        <SearchDialog />
      </SearchMenuProvider>
    </>
  )
}
