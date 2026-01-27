"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MobileHeader } from "@/components/mobile-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { HazardReportForm } from "@/components/hazard-report-form"
import { MobileAlerts } from "@/components/mobile-alerts"
import { MobileMap } from "@/components/mobile-map"
import { MobileDashboard } from "@/components/mobile-dashboard"
import { AlertTriangle, Plus } from "lucide-react"

export function MobileInterface() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showReportForm, setShowReportForm] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MobileDashboard />
      case "alerts":
        return <MobileAlerts />
      case "map":
        return <MobileMap />
      case "report":
        return <HazardReportForm onClose={() => setShowReportForm(false)} />
      default:
        return <MobileDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader />

      {/* Emergency Alert Banner */}
      <div className="bg-red-600 text-white p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">High Wave Alert Active - Avoid Coastal Areas</span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
          onClick={() => setShowReportForm(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <HazardReportForm onClose={() => setShowReportForm(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">{renderContent()}</main>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
