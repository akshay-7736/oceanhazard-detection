"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, AlertTriangle } from "lucide-react"

export function EvacuationPlanning() {
  const evacuationZones = [
    {
      id: "Zone-A",
      name: "Coastal Zone A",
      population: 2500,
      evacuated: 1875,
      status: "In Progress",
      priority: "Critical",
    },
    { id: "Zone-B", name: "Harbor District", population: 850, evacuated: 680, status: "In Progress", priority: "High" },
    { id: "Zone-C", name: "Marina Area", population: 1200, evacuated: 1200, status: "Complete", priority: "Medium" },
  ]

  const evacuationRoutes = [
    { id: "Route-1", name: "Coastal Highway North", status: "Open", capacity: "2000/hr", congestion: "Light" },
    { id: "Route-2", name: "Main Street Corridor", status: "Open", capacity: "1500/hr", congestion: "Moderate" },
    { id: "Route-3", name: "Harbor Bridge", status: "Closed", capacity: "800/hr", congestion: "Blocked" },
  ]

  const shelters = [
    {
      name: "Community Center North",
      capacity: 500,
      occupied: 320,
      status: "Open",
      amenities: ["Food", "Medical", "Pet-Friendly"],
    },
    { name: "High School Gymnasium", capacity: 800, occupied: 650, status: "Open", amenities: ["Food", "Medical"] },
    {
      name: "Convention Center",
      capacity: 1200,
      occupied: 890,
      status: "Open",
      amenities: ["Food", "Medical", "Pet-Friendly", "Special Needs"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evacuation Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evacuationZones.map((zone) => {
              const evacuationPercent = (zone.evacuated / zone.population) * 100

              return (
                <div key={zone.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          zone.priority === "Critical"
                            ? "destructive"
                            : zone.priority === "High"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {zone.priority}
                      </Badge>
                      <h3 className="font-semibold">{zone.name}</h3>
                    </div>
                    <Badge variant={zone.status === "Complete" ? "default" : "secondary"}>{zone.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Population: {zone.population.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Evacuated: {zone.evacuated.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Remaining: {(zone.population - zone.evacuated).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${evacuationPercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{evacuationPercent.toFixed(1)}% Evacuated</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evacuation Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evacuationRoutes.map((route) => (
                <div key={route.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{route.name}</h3>
                    <Badge variant={route.status === "Open" ? "default" : "destructive"}>{route.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span>Capacity: {route.capacity}</span>
                    <span>Traffic: {route.congestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Shelters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shelters.map((shelter, index) => {
                const occupancyPercent = (shelter.occupied / shelter.capacity) * 100

                return (
                  <div key={index} className="p-3 border rounded-lg">
                    <h3 className="font-semibold mb-2">{shelter.name}</h3>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Occupied: {shelter.occupied}</span>
                        <span>Capacity: {shelter.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            occupancyPercent < 70
                              ? "bg-green-500"
                              : occupancyPercent < 90
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {shelter.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
