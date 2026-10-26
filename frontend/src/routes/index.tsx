import HeroSearch from "@/components/HeroSearch"
import { PageLayout } from "@/components/layout/PageLayout"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

const RECENTS = [
  { id: "CA-0419", colour: "bg-run-1" },
  { id: "MC-031", colour: "bg-run-1" },
  { id: "CA-0421", colour: "bg-run-3" },
  { id: "CA-08", colour: "bg-run-5" },
]

function HomePage() {
  return (
    <PageLayout className="mt-6">
      <HeroSearch recents={RECENTS} />
    </PageLayout>
  )
}
