"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

export function IncidentCommand() {
  const commandStructure = [
    { role: "Incident Commander", name: "Chief Martinez", status: "Active", contact: "+1-555-0101" },
    { role: "Operations Chief", name: "Lt. Johnson", status: "Active", contact: "+1-555-0102" },
    { role: "Planning Chief", name: "Capt. Williams", status: "Active", contact: "+1-555-0103" },
    { role: "Logistics Chief", name: "Sgt. Brown", status: "Standby", contact: "+1-555-0104" },
  ]

  const objectives = [
    {
      id: 1,
      objective: "Evacuate Coastal Zone A residents",
      priority: "Critical",
      status: "In Progress",
      progress: 75,
    },
    { id: 2, objective: "Establish emergency shelters", priority: "High", status: "Complete", progress: 100 },
    { id: 3, objective: "Deploy rescue boats to harbor", priority: "High", status: "In Progress", progress: 60 },
    { id: 4, objective: "Coordinate with Coast Guard", priority: "Medium", status: "Pending", progress: 0 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Incident Command Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commandStructure.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{member.role}</h3>
                  <p className="text-sm text-muted-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.contact}</p>
                </div>
                <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives.map((obj) => (
              <div key={obj.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      obj.priority === "Critical" ? "destructive" : obj.priority === "High" ? "default" : "secondary"
                    }
                  >
                    {obj.priority}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {obj.status === "Complete" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : obj.status === "In Progress" ? (
                      <Clock className="w-4 h-4 text-blue-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-sm">{obj.status}</span>
                  </div>
                </div>
                <h3 className="font-medium mb-2">{obj.objective}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${obj.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{obj.progress}% Complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
