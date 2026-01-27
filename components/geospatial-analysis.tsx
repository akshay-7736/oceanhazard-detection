"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, Users } from "lucide-react"

export function GeospatialAnalysis() {
  const riskZones = [
    { id: 1, name: "North Coast High Risk", level: "Critical", population: 12500, area: "15.2 km²" },
    { id: 2, name: "Central Bay Medium Risk", level: "High", population: 8900, area: "22.1 km²" },
    { id: 3, name: "South Harbor Watch", level: "Medium", population: 6700, area: "18.5 km²" },
    { id: 4, name: "East Shore Monitor", level: "Low", population: 4200, area: "12.8 km²" },
  ]

  const evacuationRoutes = [
    { id: 1, name: "Route A - Coastal Highway", capacity: 5000, time: "15 min", status: "Clear" },
    { id: 2, name: "Route B - Mountain Pass", capacity: 3500, time: "25 min", status: "Congested" },
    { id: 3, name: "Route C - Valley Road", capacity: 4200, time: "20 min", status: "Clear" },
    { id: 4, name: "Route D - Bridge Crossing", capacity: 2800, time: "30 min", status: "Maintenance" },
  ]

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Geospatial Risk Analysis</CardTitle>
              <CardDescription>Geographic risk assessment and evacuation planning</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="risk">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Risk Zones</SelectItem>
                  <SelectItem value="population">Population Density</SelectItem>
                  <SelectItem value="evacuation">Evacuation Routes</SelectItem>
                  <SelectItem value="sensors">Sensor Coverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Zone Map</CardTitle>
            <CardDescription>Interactive coastal risk assessment visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-blue-100 dark:bg-blue-950 relative rounded-lg overflow-hidden">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 dark:from-blue-900 dark:to-green-900"></div>

              {/* Risk Zones */}
              <div className="absolute top-4 left-4 w-16 h-12 bg-red-500 opacity-70 rounded"></div>
              <div className="absolute top-8 right-8 w-20 h-16 bg-orange-500 opacity-70 rounded"></div>
              <div className="absolute bottom-8 left-8 w-18 h-14 bg-yellow-500 opacity-70 rounded"></div>
              <div className="absolute bottom-4 right-4 w-14 h-10 bg-green-500 opacity-70 rounded"></div>

              {/* Evacuation Routes */}
              <svg className="absolute inset-0 w-full h-full">
                <path d="M 20 200 Q 150 100 280 180" stroke="#3b82f6" strokeWidth="3" fill="none" />
                <path d="M 50 350 Q 200 250 350 320" stroke="#10b981" strokeWidth="3" fill="none" />
                <path d="M 100 50 Q 200 150 300 100" stroke="#f59e0b" strokeWidth="3" fill="none" />
              </svg>

              {/* Sensor Locations */}
              {[
                { x: 60, y: 80 },
                { x: 180, y: 120 },
                { x: 280, y: 200 },
                { x: 120, y: 280 },
                { x: 320, y: 320 },
              ].map((sensor, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white"
                  style={{ left: sensor.x, top: sensor.y }}
                ></div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <p className="text-xs font-medium mb-2">Risk Levels</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">Critical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-xs">High</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Zone Details */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Zone Analysis</CardTitle>
            <CardDescription>Detailed risk assessment by geographic area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskZones.map((zone) => (
                <div key={zone.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{zone.population.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Layers className="h-3 w-3" />
                          <span>{zone.area}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        zone.level === "Critical"
                          ? "destructive"
                          : zone.level === "High"
                            ? "default"
                            : zone.level === "Medium"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {zone.level}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-medium">Tsunami Risk</p>
                      <p className="text-muted-foreground">
                        {zone.level === "Critical" ? "Very High" : zone.level === "High" ? "High" : "Moderate"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-medium">Flood Risk</p>
                      <p className="text-muted-foreground">
                        {zone.level === "Critical" ? "Extreme" : zone.level === "High" ? "High" : "Low"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-medium">Evacuation</p>
                      <p className="text-muted-foreground">
                        {zone.level === "Critical" ? "Immediate" : zone.level === "High" ? "Priority" : "Standard"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evacuation Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Evacuation Route Status</CardTitle>
          <CardDescription>Real-time evacuation route capacity and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evacuationRoutes.map((route) => (
              <div key={route.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{route.name}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span>Capacity: {route.capacity.toLocaleString()}</span>
                      <span>ETA: {route.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      route.status === "Clear" ? "default" : route.status === "Congested" ? "secondary" : "destructive"
                    }
                  >
                    {route.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        route.status === "Clear"
                          ? "bg-green-500"
                          : route.status === "Congested"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: route.status === "Clear" ? "25%" : route.status === "Congested" ? "75%" : "100%",
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {route.status === "Clear" ? "25%" : route.status === "Congested" ? "75%" : "100%"} utilized
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
