"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Users, MapPin, Clock, Radio, Truck, Shield } from "lucide-react"
import { IncidentCommand } from "./incident-command"
import { ResourceManagement } from "./resource-management"
import { EvacuationPlanning } from "./evacuation-planning"
import { EmergencyComms } from "./emergency-comms"

export function EmergencyResponse() {
  const [activeIncidents, setActiveIncidents] = useState([
    {
      id: "INC-001",
      type: "Tsunami Warning",
      severity: "Critical",
      location: "Coastal Zone A",
      time: "14:23",
      status: "Active",
      responders: 12,
      evacuees: 2500,
    },
    {
      id: "INC-002",
      type: "Storm Surge",
      severity: "High",
      location: "Harbor District",
      time: "14:45",
      status: "Monitoring",
      responders: 8,
      evacuees: 850,
    },
  ])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Response Center</h1>
          <p className="text-muted-foreground">Incident command and emergency coordination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Declare Emergency
          </Button>
          <Button variant="outline" size="sm">
            <Radio className="w-4 h-4 mr-2" />
            Emergency Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold">{activeIncidents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Responders</p>
                <p className="text-2xl font-bold">20</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">People Evacuated</p>
                <p className="text-2xl font-bold">3,350</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resources Deployed</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={incident.severity === "Critical" ? "destructive" : "secondary"}>
                    {incident.severity}
                  </Badge>
                  <div>
                    <h3 className="font-semibold">{incident.type}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {incident.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {incident.responders} responders
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="command" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="command">Incident Command</TabsTrigger>
          <TabsTrigger value="resources">Resource Management</TabsTrigger>
          <TabsTrigger value="evacuation">Evacuation Planning</TabsTrigger>
          <TabsTrigger value="communications">Emergency Comms</TabsTrigger>
        </TabsList>

        <TabsContent value="command">
          <IncidentCommand />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceManagement />
        </TabsContent>

        <TabsContent value="evacuation">
          <EvacuationPlanning />
        </TabsContent>

        <TabsContent value="communications">
          <EmergencyComms />
        </TabsContent>
      </Tabs>
    </div>
  )
}
