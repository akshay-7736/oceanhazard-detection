"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves, Thermometer, Wind, Activity, AlertTriangle, Clock } from "lucide-react"

export function MobileDashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Current Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Waves className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xl font-bold">4.2m</p>
              <p className="text-xs text-muted-foreground">Wave Height</p>
              <Badge variant="destructive" className="mt-1 text-xs">
                High
              </Badge>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-xl font-bold">23.4°C</p>
              <p className="text-xs text-muted-foreground">Water Temp</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Normal
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <Wind className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-xl font-bold">28 km/h</p>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Moderate
              </Badge>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xl font-bold">2.1M</p>
              <p className="text-xs text-muted-foreground">Seismic</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Low
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Active Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="destructive">Critical</Badge>
              <span className="text-xs text-muted-foreground">15 min ago</span>
            </div>
            <p className="font-medium text-sm">High Wave Alert - Pacific Coast</p>
            <p className="text-xs text-muted-foreground mt-1">
              Wave heights exceeding 4.2m detected. Avoid coastal areas.
            </p>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="default">High</Badge>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <p className="font-medium text-sm">Coastal Flooding Watch</p>
            <p className="text-xs text-muted-foreground mt-1">
              Rising water levels may cause flooding in low-lying areas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { type: "Sensor Update", message: "Buoy B001 reported high waves", time: "2 min ago" },
            { type: "Citizen Report", message: "Flooding reported at Marina Bay", time: "8 min ago" },
            { type: "System Alert", message: "Weather station maintenance completed", time: "15 min ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-xs text-muted-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">High Wave Conditions</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Stay away from beaches, piers, and rocky coastlines. Waves can sweep people into the ocean.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
