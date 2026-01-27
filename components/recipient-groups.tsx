"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Users, Edit, Trash2, UserPlus } from "lucide-react"

export function RecipientGroups() {
  const groups = [
    {
      id: "GRP-001",
      name: "All Citizens",
      description: "Complete citizen database for emergency notifications",
      members: 8247,
      active: 8102,
      channels: ["SMS", "Email", "Push"],
      lastUpdated: "2 hours ago",
      deliveryRate: 98.2,
    },
    {
      id: "GRP-002",
      name: "Coastal Residents",
      description: "Residents living within 2km of coastline",
      members: 3421,
      active: 3398,
      channels: ["SMS", "Email", "Push", "Sirens"],
      lastUpdated: "1 day ago",
      deliveryRate: 99.3,
    },
    {
      id: "GRP-003",
      name: "Emergency Officials",
      description: "Government officials and emergency coordinators",
      members: 156,
      active: 156,
      channels: ["SMS", "Email", "Push", "Radio"],
      lastUpdated: "3 hours ago",
      deliveryRate: 100,
    },
    {
      id: "GRP-004",
      name: "First Responders",
      description: "Police, fire, medical, and rescue personnel",
      members: 89,
      active: 87,
      channels: ["SMS", "Push", "Radio"],
      lastUpdated: "30 minutes ago",
      deliveryRate: 97.8,
    },
    {
      id: "GRP-005",
      name: "Media Contacts",
      description: "Local and regional media representatives",
      members: 23,
      active: 23,
      channels: ["Email", "SMS"],
      lastUpdated: "1 week ago",
      deliveryRate: 100,
    },
    {
      id: "GRP-006",
      name: "Tourist Areas",
      description: "Hotels, resorts, and tourist information centers",
      members: 67,
      active: 64,
      channels: ["Email", "Push"],
      lastUpdated: "2 days ago",
      deliveryRate: 95.5,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recipient Groups</h2>
          <p className="text-muted-foreground">Manage notification recipient groups and contact lists</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search groups..." className="pl-10" />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{group.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                </div>
                <Badge variant="outline">{group.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Member Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{group.members}</p>
                  <p className="text-xs text-muted-foreground">Total Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{group.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>

              {/* Delivery Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Delivery Rate</span>
                  <span className="text-sm text-muted-foreground">{group.deliveryRate}%</span>
                </div>
                <Progress value={group.deliveryRate} className="h-2" />
              </div>

              {/* Channels */}
              <div>
                <p className="text-sm font-medium mb-2">Notification Channels</p>
                <div className="flex flex-wrap gap-1">
                  {group.channels.map((channel) => (
                    <Badge key={channel} variant="secondary" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              <p className="text-xs text-muted-foreground">Last updated: {group.lastUpdated}</p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add Members
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
