import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RealMap } from "@/components/real-map"

export default function MapPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-0">
          <RealMap />
        </main>
      </div>
    </div>
  )
}
