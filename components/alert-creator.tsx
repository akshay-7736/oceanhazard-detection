"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Send, Eye, Save } from "lucide-react"

interface AlertCreatorProps {
  onClose: () => void
}

export function AlertCreator({ onClose }: AlertCreatorProps) {
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    severity: "",
    type: "",
    location: "",
    duration: "",
    channels: [] as string[],
    groups: [] as string[],
  })

  const severityLevels = [
    { value: "critical", label: "Critical", color: "destructive" },
    { value: "high", label: "High", color: "default" },
    { value: "medium", label: "Medium", color: "secondary" },
    { value: "low", label: "Low", color: "outline" },
  ]

  const alertTypes = [
    "Tsunami Warning",
    "High Wave Advisory",
    "Coastal Flooding",
    "Storm Surge",
    "Seismic Activity",
    "Weather Alert",
    "System Maintenance",
  ]

  const channels = [
    { id: "sms", label: "SMS" },
    { id: "email", label: "Email" },
    { id: "push", label: "Push Notifications" },
    { id: "sirens", label: "Emergency Sirens" },
    { id: "radio", label: "Emergency Radio" },
    { id: "social", label: "Social Media" },
  ]

  const recipientGroups = [
    { id: "citizens", label: "All Citizens", count: 8247 },
    { id: "coastal", label: "Coastal Residents", count: 3421 },
    { id: "officials", label: "Emergency Officials", count: 156 },
    { id: "responders", label: "First Responders", count: 89 },
    { id: "media", label: "Media Contacts", count: 23 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Create Emergency Alert</CardTitle>
            <CardDescription>Compose and send emergency notifications to selected groups</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                placeholder="Enter alert title..."
                value={alertData.title}
                onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Alert Type</Label>
              <Select value={alertData.type} onValueChange={(value) => setAlertData({ ...alertData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={alertData.severity}
                onValueChange={(value) => setAlertData({ ...alertData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center space-x-2">
                        <Badge variant={level.color as any}>{level.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Affected Location</Label>
              <Input
                id="location"
                placeholder="e.g., Pacific Coast, North Bay..."
                value={alertData.location}
                onChange={(e) => setAlertData({ ...alertData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Alert Message</Label>
            <Textarea
              id="message"
              placeholder="Enter detailed alert message..."
              rows={4}
              value={alertData.message}
              onChange={(e) => setAlertData({ ...alertData, message: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">{alertData.message.length}/500 characters</p>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-3">
            <Label>Delivery Channels</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel.id}
                    checked={alertData.channels.includes(channel.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAlertData({
                          ...alertData,
                          channels: [...alertData.channels, channel.id],
                        })
                      } else {
                        setAlertData({
                          ...alertData,
                          channels: alertData.channels.filter((c) => c !== channel.id),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={channel.id} className="text-sm">
                    {channel.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Groups */}
          <div className="space-y-3">
            <Label>Recipient Groups</Label>
            <div className="space-y-2">
              {recipientGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={group.id}
                      checked={alertData.groups.includes(group.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAlertData({
                            ...alertData,
                            groups: [...alertData.groups, group.id],
                          })
                        } else {
                          setAlertData({
                            ...alertData,
                            groups: alertData.groups.filter((g) => g !== group.id),
                          })
                        }
                      }}
                    />
                    <div>
                      <Label htmlFor={group.id} className="font-medium">
                        {group.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{group.count} recipients</p>
                    </div>
                  </div>
                  <Badge variant="outline">{group.count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Alert Duration</Label>
            <Select
              value={alertData.duration}
              onValueChange={(value) => setAlertData({ ...alertData, duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="2h">2 Hours</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="8h">8 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="manual">Until Manually Stopped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Send className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
