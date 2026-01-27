"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Bell, MapPin, AlertTriangle } from "lucide-react"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "map", label: "Map", icon: MapPin },
    { id: "report", label: "Report", icon: AlertTriangle },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-40">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-12 p-1"
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
