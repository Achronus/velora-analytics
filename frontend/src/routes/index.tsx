import Hero from "@/components/Hero"
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
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-8 pt-9 pb-8">
      <Hero recents={RECENTS} />
    </main>
  )
}
