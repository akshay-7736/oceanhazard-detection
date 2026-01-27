"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, BarChart3, MessageSquare, Users, Settings, Menu, X, MapPin } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Monitoring", href: "/monitoring", icon: AlertTriangle },
  { name: "Alerts", href: "/alerts", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Social Extraction", href: "/social-extraction", icon: MessageSquare },
  { name: "Live Map", href: "/map", icon: MapPin },
  { name: "Mobile App", href: "/mobile", icon: MessageSquare },
  { name: "Emergency", href: "/emergency", icon: Users },
  { name: "API Test", href: "/api-test", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-border">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-bold text-foreground">OceanGuard</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Emergency Contact */}
          <div className="p-4 border-t border-border">
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              <p className="text-xs font-medium text-red-800 dark:text-red-200">Emergency Hotline</p>
              <p className="text-sm font-bold text-red-900 dark:text-red-100">1-800-OCEAN-911</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
