"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, Menu, Wifi, WifiOff } from "lucide-react"
import { useState } from "react"

export function MobileHeader() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <header className="bg-card border-b border-border p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold">OceanGuard</h1>
            <div className="flex items-center space-x-2">
              {isOnline ? <Wifi className="h-3 w-3 text-green-600" /> : <WifiOff className="h-3 w-3 text-red-600" />}
              <span className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500">
              2
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
