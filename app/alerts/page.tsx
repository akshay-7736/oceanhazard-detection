import { AlertManagement } from "@/components/alert-management"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function AlertsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <AlertManagement />
        </main>
      </div>
    </div>
  )
}
