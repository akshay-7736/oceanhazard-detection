"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

export function MobileAlerts() {
  const [soundEnabled, setSoundEnabled] = useState(true)

  const alerts = [
    {
      id: "ALT-001",
      title: "High Wave Alert",
      message: "Wave heights exceeding 4.2m detected at Pacific Coast. Avoid coastal areas and beaches.",
      severity: "Critical",
      location: "Pacific Coast Sector 7",
      time: "15 minutes ago",
      expires: "2 hours",
      active: true,
    },
    {
      id: "ALT-002",
      title: "Coastal Flooding Watch",
      message: "Rising water levels may cause flooding in low-lying coastal areas. Monitor conditions.",
      severity: "High",
      location: "Downtown Waterfront",
      time: "1 hour ago",
      expires: "4 hours",
      active: true,
    },
    {
      id: "ALT-003",
      title: "System Maintenance",
      message: "Monitoring systems will be offline for scheduled maintenance from 2-4 AM.",
      severity: "Low",
      location: "System Wide",
      time: "3 hours ago",
      expires: "1 hour",
      active: false,
    },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Alert Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Alert Settings</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              {soundEnabled ? "Sound On" : "Sound Off"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Active Alerts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        {alerts
          .filter((alert) => alert.active)
          .map((alert) => (
            <Card
              key={alert.id}
              className={`${
                alert.severity === "Critical"
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : alert.severity === "High"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                    : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.severity === "Critical"
                          ? "text-red-600"
                          : alert.severity === "High"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    />
                    <Badge
                      variant={
                        alert.severity === "Critical"
                          ? "destructive"
                          : alert.severity === "High"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>

                <h3 className="font-semibold mb-2">{alert.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Expires in {alert.expires}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        {alerts
          .filter((alert) => !alert.active)
          .map((alert) => (
            <Card key={alert.id} className="opacity-60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{alert.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
                <h3 className="font-medium text-sm mb-1">{alert.title}</h3>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
