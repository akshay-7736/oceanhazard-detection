"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Radio, Phone, Megaphone, Satellite, MessageSquare, Send, AlertTriangle } from "lucide-react"

export function EmergencyComms() {
  const communicationChannels = [
    { name: "Emergency Radio", icon: Radio, status: "Active", frequency: "155.175 MHz", users: 24 },
    { name: "Satellite Phone", icon: Satellite, status: "Active", frequency: "Iridium Network", users: 8 },
    { name: "Public Address", icon: Megaphone, status: "Active", frequency: "Local Broadcast", users: 12 },
    { name: "Emergency Hotline", icon: Phone, status: "Active", frequency: "911 System", users: 156 },
  ]

  const recentMessages = [
    {
      id: 1,
      from: "Incident Commander",
      message: "All units, evacuation of Zone A is 75% complete. Continue operations.",
      time: "14:45",
      priority: "High",
    },
    {
      id: 2,
      from: "Coast Guard",
      message: "Rescue boats deployed to harbor district. ETA 10 minutes.",
      time: "14:42",
      priority: "Medium",
    },
    {
      id: 3,
      from: "Medical Team",
      message: "Shelter medical stations fully operational. Ready for evacuees.",
      time: "14:38",
      priority: "Low",
    },
    {
      id: 4,
      from: "Fire Chief",
      message: "Route 3 blocked due to debris. Redirecting traffic to Route 1.",
      time: "14:35",
      priority: "High",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {communicationChannels.map((channel, index) => {
          const Icon = channel.icon

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-sm">{channel.name}</h3>
                    <p className="text-xs text-muted-foreground">{channel.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={channel.status === "Active" ? "default" : "secondary"}>{channel.status}</Badge>
                  <span className="text-sm text-muted-foreground">{channel.users} users</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Broadcast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Type your emergency message here..." className="min-h-[120px]" />
            <div className="flex gap-2">
              <Button className="flex-1">
                <Megaphone className="w-4 h-4 mr-2" />
                Public Broadcast
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Radio className="w-4 h-4 mr-2" />
                Radio Only
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                SMS Alert
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-2" />
                Social Media
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{message.from}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          message.priority === "High"
                            ? "destructive"
                            : message.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {message.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Communication Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-16 flex-col">
              <AlertTriangle className="w-6 h-6 mb-2" />
              Emergency Alert
            </Button>
            <Button variant="outline" className="h-16 flex-col bg-transparent">
              <Radio className="w-6 h-6 mb-2" />
              All Units Check-In
            </Button>
            <Button variant="outline" className="h-16 flex-col bg-transparent">
              <Megaphone className="w-6 h-6 mb-2" />
              Evacuation Notice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
