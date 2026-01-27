"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Camera, Send, Wifi, WifiOff } from "lucide-react"

interface HazardReportFormProps {
  onClose: () => void
}

export function HazardReportForm({ onClose }: HazardReportFormProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [location, setLocation] = useState("")
  const [reportData, setReportData] = useState({
    type: "",
    severity: "",
    description: "",
    location: "",
    media: [] as File[],
  })

  const hazardTypes = [
    "High Waves",
    "Coastal Flooding",
    "Storm Surge",
    "Tsunami",
    "Seismic Activity",
    "Debris/Obstruction",
    "Other",
  ]

  const severityLevels = [
    { value: "low", label: "Low", color: "secondary" },
    { value: "medium", label: "Medium", color: "default" },
    { value: "high", label: "High", color: "destructive" },
    { value: "critical", label: "Critical", color: "destructive" },
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setReportData({ ...reportData, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = () => {
    if (isOffline) {
      // Save to local storage for later sync
      const offlineReports = JSON.parse(localStorage.getItem("offlineReports") || "[]")
      offlineReports.push({ ...reportData, timestamp: new Date().toISOString() })
      localStorage.setItem("offlineReports", JSON.stringify(offlineReports))
    }
    onClose()
  }

  return (
    <Card className="w-full max-w-md mx-auto m-4 max-h-[90vh] overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg">Report Hazard</CardTitle>
          <div className="flex items-center space-x-2 mt-1">
            {isOffline ? (
              <>
                <WifiOff className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">Offline - Will sync later</span>
              </>
            ) : (
              <>
                <Wifi className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Online</span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hazard Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Hazard Type</Label>
          <Select value={reportData.type} onValueChange={(value) => setReportData({ ...reportData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select hazard type" />
            </SelectTrigger>
            <SelectContent>
              {hazardTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <Label htmlFor="severity">Severity Level</Label>
          <Select
            value={reportData.severity}
            onValueChange={(value) => setReportData({ ...reportData, severity: value })}
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

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="flex space-x-2">
            <Input
              id="location"
              placeholder="Enter location or use GPS"
              value={reportData.location}
              onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={getCurrentLocation}>
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what you observed..."
            rows={3}
            value={reportData.description}
            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
          />
        </div>

        {/* Media Upload */}
        <div className="space-y-2">
          <Label>Photos/Videos (Optional)</Label>
          <Button variant="outline" className="w-full bg-transparent">
            <Camera className="h-4 w-4 mr-2" />
            Add Photos/Videos
          </Button>
          {reportData.media.length > 0 && (
            <div className="text-xs text-muted-foreground">{reportData.media.length} file(s) selected</div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">Emergency?</p>
          <p className="text-xs text-red-600 dark:text-red-300 mt-1">
            For immediate emergencies, call 911 or emergency services directly.
          </p>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {isOffline ? "Save Report (Offline)" : "Submit Report"}
        </Button>
      </CardContent>
    </Card>
  )
}
