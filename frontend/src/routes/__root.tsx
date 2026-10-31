import SearchDialog from "@/components/SearchDialog"
import { SiteHeader } from "@/components/SiteHeader"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { SearchMenuProvider } from "@velora/components/providers"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <SearchMenuProvider>
        <SiteHeader />
        <main id="main">
          <Outlet />
        </main>
        <SearchDialog />
      </SearchMenuProvider>
    </>
  )
}
