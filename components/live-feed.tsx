"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, MapPin, Clock } from "lucide-react"

export function LiveFeed() {
  const feedItems = [
    {
      id: 1,
      type: "sensor",
      title: "Buoy B001 - High Wave Alert",
      description: "Wave height exceeded 4.0m threshold",
      location: "North Bay Sector",
      timestamp: "2 minutes ago",
      severity: "high",
      icon: Activity,
    },
    {
      id: 2,
      type: "seismic",
      title: "Seismic Event Detected",
      description: "Magnitude 2.3 earthquake recorded",
      location: "23km E of harbor",
      timestamp: "8 minutes ago",
      severity: "medium",
      icon: Activity,
    },
    {
      id: 3,
      type: "weather",
      title: "Wind Speed Increase",
      description: "Sustained winds now at 38 km/h",
      location: "Central Weather Station",
      timestamp: "12 minutes ago",
      severity: "low",
      icon: Activity,
    },
    {
      id: 4,
      type: "citizen",
      title: "Citizen Report - Coastal Flooding",
      description: "Water levels rising near downtown pier",
      location: "Downtown Waterfront",
      timestamp: "15 minutes ago",
      severity: "medium",
      icon: MapPin,
    },
    {
      id: 5,
      type: "system",
      title: "Sensor Network Status",
      description: "All monitoring stations operational",
      location: "System Wide",
      timestamp: "20 minutes ago",
      severity: "info",
      icon: Activity,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Live Activity Feed</span>
        </CardTitle>
        <CardDescription>Real-time updates from all monitoring systems</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {feedItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      item.severity === "high"
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        : item.severity === "medium"
                          ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                          : item.severity === "low"
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <Badge
                        variant={
                          item.severity === "high"
                            ? "destructive"
                            : item.severity === "medium"
                              ? "default"
                              : item.severity === "low"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
