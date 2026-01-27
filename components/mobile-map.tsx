"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Layers, Navigation, Zap } from "lucide-react"
import { useState } from "react"

export function MobileMap() {
  const [mapLayer, setMapLayer] = useState("hazards")

  const hazardPoints = [
    { id: 1, type: "High Waves", severity: "Critical", lat: 37.7749, lng: -122.4194, reports: 12 },
    { id: 2, type: "Flooding", severity: "High", lat: 37.7849, lng: -122.4094, reports: 8 },
    { id: 3, type: "Debris", severity: "Medium", lat: 37.7649, lng: -122.4294, reports: 3 },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Interactive Map</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-blue-100 dark:bg-blue-950 relative rounded-lg overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-900 dark:to-blue-800"></div>

            {/* Hazard Markers */}
            {hazardPoints.map((point) => (
              <div
                key={point.id}
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  point.severity === "Critical"
                    ? "bg-red-600"
                    : point.severity === "High"
                      ? "bg-orange-600"
                      : "bg-yellow-600"
                }`}
                style={{
                  left: `${((point.lng + 122.5) / 0.1) * 10}%`,
                  top: `${((37.8 - point.lat) / 0.1) * 10}%`,
                }}
              >
                <Zap className="h-3 w-3" />
              </div>
            ))}

            {/* Current Location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
              <p className="text-xs font-medium mb-1">Legend</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-xs">Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  <span className="text-xs">Medium</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Hazards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Nearby Hazards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hazardPoints.map((hazard) => (
            <div key={hazard.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    hazard.severity === "Critical"
                      ? "bg-red-600"
                      : hazard.severity === "High"
                        ? "bg-orange-600"
                        : "bg-yellow-600"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-sm">{hazard.type}</p>
                  <p className="text-xs text-muted-foreground">{hazard.reports} reports</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    hazard.severity === "Critical"
                      ? "destructive"
                      : hazard.severity === "High"
                        ? "default"
                        : "secondary"
                  }
                >
                  {hazard.severity}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">0.8 km away</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 bg-transparent">
          <MapPin className="h-4 w-4 mr-2" />
          My Location
        </Button>
        <Button variant="outline" className="h-12 bg-transparent">
          <Layers className="h-4 w-4 mr-2" />
          Map Layers
        </Button>
      </div>
    </div>
  )
}
