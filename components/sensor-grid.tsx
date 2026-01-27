"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Battery, Signal } from "lucide-react"

export function SensorGrid() {
  const sensors = [
    {
      id: "B001",
      name: "North Bay Buoy",
      type: "Wave Monitor",
      status: "online",
      battery: 87,
      signal: 95,
      lastUpdate: "30s ago",
      data: { waves: "4.2m", temp: "23.1°C", wind: "28 km/h" },
    },
    {
      id: "B002",
      name: "Central Coast Buoy",
      type: "Wave Monitor",
      status: "online",
      battery: 92,
      signal: 88,
      lastUpdate: "45s ago",
      data: { waves: "2.8m", temp: "23.4°C", wind: "25 km/h" },
    },
    {
      id: "S001",
      name: "Harbor Seismometer",
      type: "Seismic Monitor",
      status: "online",
      battery: 78,
      signal: 92,
      lastUpdate: "1m ago",
      data: { magnitude: "1.2M", depth: "8km", frequency: "2.1Hz" },
    },
    {
      id: "W001",
      name: "Coastal Weather Station",
      type: "Weather Monitor",
      status: "maintenance",
      battery: 45,
      signal: 67,
      lastUpdate: "15m ago",
      data: { wind: "32 km/h", pressure: "1008 hPa", humidity: "87%" },
    },
    {
      id: "B003",
      name: "South Harbor Buoy",
      type: "Wave Monitor",
      status: "offline",
      battery: 12,
      signal: 0,
      lastUpdate: "2h ago",
      data: { waves: "--", temp: "--", wind: "--" },
    },
    {
      id: "S002",
      name: "Deep Water Seismometer",
      type: "Seismic Monitor",
      status: "online",
      battery: 89,
      signal: 85,
      lastUpdate: "2m ago",
      data: { magnitude: "0.8M", depth: "12km", frequency: "1.8Hz" },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sensor Network Status</h2>
        <p className="text-muted-foreground">Real-time status of all monitoring equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <Card
            key={sensor.id}
            className={`${
              sensor.status === "offline"
                ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                : sensor.status === "maintenance"
                  ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
                  : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{sensor.id}</CardTitle>
                  <CardDescription className="text-sm">{sensor.name}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  {sensor.status === "online" ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  <Badge
                    variant={
                      sensor.status === "online"
                        ? "default"
                        : sensor.status === "maintenance"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {sensor.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">{sensor.type}</p>
                <p className="text-xs text-muted-foreground">Last update: {sensor.lastUpdate}</p>
              </div>

              {/* Battery and Signal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Battery className="h-3 w-3" />
                    <span className="text-xs">Battery</span>
                  </div>
                  <Progress value={sensor.battery} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{sensor.battery}%</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Signal className="h-3 w-3" />
                    <span className="text-xs">Signal</span>
                  </div>
                  <Progress value={sensor.signal} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{sensor.signal}%</p>
                </div>
              </div>

              {/* Sensor Data */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium mb-2">Current Readings</p>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(sensor.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
