"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Users, Shield, Plane, Bolt as Boat, Ambulance } from "lucide-react"

export function ResourceManagement() {
  const resources = [
    { type: "Fire Trucks", icon: Truck, available: 8, deployed: 5, total: 13, status: "Good" },
    { type: "Ambulances", icon: Ambulance, available: 12, deployed: 8, total: 20, status: "Good" },
    { type: "Rescue Boats", icon: Boat, available: 3, deployed: 4, total: 7, status: "Limited" },
    { type: "Helicopters", icon: Plane, available: 1, deployed: 2, total: 3, status: "Critical" },
    { type: "Personnel", icon: Users, available: 45, deployed: 78, total: 123, status: "Good" },
    { type: "Shelters", icon: Shield, available: 2, deployed: 3, total: 5, status: "Good" },
  ]

  const deployments = [
    { id: "DEP-001", resource: "Fire Truck Unit 7", location: "Coastal Zone A", time: "14:30", status: "En Route" },
    { id: "DEP-002", resource: "Rescue Boat Alpha", location: "Harbor District", time: "14:25", status: "On Scene" },
    { id: "DEP-003", resource: "Helicopter Med-1", location: "Evacuation Point B", time: "14:40", status: "Returning" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon
          const availabilityPercent = (resource.available / resource.total) * 100

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">{resource.type}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available: {resource.available}</span>
                    <span>Deployed: {resource.deployed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        availabilityPercent > 50
                          ? "bg-green-500"
                          : availabilityPercent > 25
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${availabilityPercent}%` }}
                    />
                  </div>
                  <Badge
                    variant={
                      resource.status === "Good"
                        ? "default"
                        : resource.status === "Limited"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {resource.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{deployment.resource}</h3>
                  <p className="text-sm text-muted-foreground">
                    {deployment.location} • Deployed at {deployment.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      deployment.status === "On Scene"
                        ? "default"
                        : deployment.status === "En Route"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {deployment.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Truck className="w-6 h-6 mb-2" />
              Request Fire Support
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Ambulance className="w-6 h-6 mb-2" />
              Request Medical Units
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Plane className="w-6 h-6 mb-2" />
              Request Air Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
