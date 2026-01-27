import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { HazardReportForm } from "@/components/hazard-report-form"

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Hazard Reports</h1>
            <HazardReportForm />
          </div>
        </main>
      </div>
    </div>
  )
}
