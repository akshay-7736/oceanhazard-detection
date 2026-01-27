"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AlertTriangle, Waves, Shield, Users, MessageSquare, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CoastalHazardReport {
  id: string
  title: string
  description: string
  type: "tsunami" | "cyclone" | "storm_surge" | "coastal_erosion" | "oil_spill" | "marine_debris" | "general"
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "verified" | "triaged" | "escalated"
  location: {
    latitude: number
    longitude: number
    address: string
    coastalZone: string
  }
  source: "citizen" | "social_media" | "sensor" | "satellite" | "official"
  socialMediaData?: {
    platform: string
    sentiment: number
    credibilityScore: number
    viralityIndex: number
    geoTagged: boolean
  }
  geoFencing: {
    radius: number
    networkNodes: number
    validationScore: number
    fakeNewsRisk: "low" | "medium" | "high"
  }
  crowdScore: number
  timestamp: string
  reporter: {
    name: string
    credibility: number
    location: string
  }
  engagement?: {
    likes?: number
    shares?: number
    comments?: number
  }
  originalPost?: {
    text: string
    url?: string
    hashtags?: string[]
  }
}

const severityColors = {
  low: "#6B7280",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
}

const hazardIcons = {
  tsunami: "🌊",
  cyclone: "🌪️",
  storm_surge: "🌀",
  coastal_erosion: "🏖️",
  oil_spill: "🛢️",
  marine_debris: "🗑️",
  general: "⚠️",
}

export const EnhancedLiveMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedReport, setSelectedReport] = useState<CoastalHazardReport | null>(null)
  const [showGeoFencing, setShowGeoFencing] = useState(true)
  const [showSocialMedia, setShowSocialMedia] = useState(true)
  const [showCrowdData, setShowCrowdData] = useState(true)
  const [zoom, setZoom] = useState(6)
  const [center, setCenter] = useState({ lat: 15.0, lng: 77.0 })
  const [coastalReports, setCoastalReports] = useState<CoastalHazardReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setIsLoading(true)
        console.log("[v0] Fetching live social media data for map...")

        const response = await fetch("/api/social/live-data?limit=20&confidence=0.5")
        const result = await response.json()

        if (result.success) {
          setCoastalReports(result.data)
          setLastUpdated(new Date().toLocaleTimeString())
          console.log("[v0] Loaded", result.data.length, "social media reports on map")
        } else {
          console.error("[v0] Failed to fetch live data:", result.error)
        }
      } catch (error) {
        console.error("[v0] Error fetching live social media data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveData()

    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.fillStyle = "#1e40af"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.beginPath()

    const coastPoints = [
      { x: canvas.width * 0.3, y: canvas.height * 0.2 },
      { x: canvas.width * 0.4, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.4 },
      { x: canvas.width * 0.6, y: canvas.height * 0.6 },
      { x: canvas.width * 0.7, y: canvas.height * 0.8 },
    ]

    coastPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()

    coastalReports.forEach((report, index) => {
      const x = report.location.latitude
        ? canvas.width * (0.3 + ((report.location.longitude - 70) / 20) * 0.4)
        : canvas.width * (0.4 + index * 0.15)
      const y = report.location.latitude
        ? canvas.height * (0.8 - ((report.location.latitude - 8) / 20) * 0.6)
        : canvas.height * (0.3 + index * 0.2)

      if (showGeoFencing) {
        ctx.beginPath()
        ctx.arc(x, y, 40, 0, 2 * Math.PI)
        ctx.strokeStyle =
          report.geoFencing.fakeNewsRisk === "low"
            ? "#10b981"
            : report.geoFencing.fakeNewsRisk === "medium"
              ? "#f59e0b"
              : "#ef4444"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = severityColors[report.severity]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      if (report.severity === "critical") {
        ctx.beginPath()
        ctx.arc(x, y, 30 + Math.sin(Date.now() / 200) * 5, 0, 2 * Math.PI)
        ctx.strokeStyle = severityColors[report.severity]
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(hazardIcons[report.type] || "⚠️", x, y + 5)

      if (showSocialMedia && report.socialMediaData) {
        ctx.beginPath()
        ctx.arc(x + 15, y - 15, 6, 0, 2 * Math.PI)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = "8px Arial"
        const platformIcon =
          report.socialMediaData.platform === "twitter"
            ? "T"
            : report.socialMediaData.platform === "instagram"
              ? "I"
              : "R"
        ctx.fillText(platformIcon, x + 15, y - 12)
      }

      if (showCrowdData) {
        ctx.beginPath()
        ctx.arc(x + 15, y + 15, 8, 0, 2 * Math.PI)
        ctx.fillStyle = report.crowdScore >= 0.8 ? "#10b981" : report.crowdScore >= 0.6 ? "#f59e0b" : "#ef4444"
        ctx.fill()
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.fillText(Math.round(report.crowdScore * 100).toString(), x + 15, y + 18)
      }
    })

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i < 10; i++) {
      const x = (canvas.width / 10) * i
      const y = (canvas.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
  }, [showGeoFencing, showSocialMedia, showCrowdData, zoom])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    coastalReports.forEach((report, index) => {
      const markerX = report.location.latitude
        ? canvas.width * (0.3 + ((report.location.longitude - 70) / 20) * 0.4)
        : canvas.width * (0.4 + index * 0.15)
      const markerY = report.location.latitude
        ? canvas.height * (0.8 - ((report.location.latitude - 8) / 20) * 0.6)
        : canvas.height * (0.3 + index * 0.2)
      const distance = Math.sqrt((x - markerX) ** 2 + (y - markerY) ** 2)

      if (distance < 25) {
        setSelectedReport(report)
      }
    })
  }

  return (
    <div className="w-full h-full relative bg-slate-900">
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Loading live social media data...</span>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        style={{ display: "block" }}
      />

      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button variant="secondary" size="sm" onClick={() => setZoom(Math.min(zoom + 1, 12))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setZoom(Math.max(zoom - 1, 2))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setZoom(6)
            setCenter({ lat: 15.0, lng: 77.0 })
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md space-y-2">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
          <Waves className="w-4 h-4 mr-1" />
          Coastal Monitoring
        </h4>
        <div className="space-y-1">
          <Button
            variant={showGeoFencing ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGeoFencing(!showGeoFencing)}
            className="w-full text-xs"
          >
            <Shield className="w-3 h-3 mr-1" />
            Geo-Fencing
          </Button>
          <Button
            variant={showSocialMedia ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSocialMedia(!showSocialMedia)}
            className="w-full text-xs"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Social Media
          </Button>
          <Button
            variant={showCrowdData ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCrowdData(!showCrowdData)}
            className="w-full text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            Crowd Data
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Coastal Hazards</h4>
        <div className="space-y-1">
          {Object.entries(hazardIcons).map(([type, icon]) => (
            <div key={type} className="flex items-center space-x-2 text-xs">
              <span role="img" aria-label={type}>
                {icon}
              </span>
              <span className="capitalize text-gray-600">{type.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Validation Status</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-gray-600">Low Fake News Risk</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-gray-600">High Risk</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400" : "bg-green-400"}`} />
          <span className="text-gray-600">Live Data {lastUpdated && `(Updated: ${lastUpdated})`}</span>
          <span className="text-blue-600 font-medium">{coastalReports.length} Reports</span>
        </div>
      </div>

      {selectedReport && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="w-80 max-w-sm bg-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: severityColors[selectedReport.severity] }} />
                  <CardTitle className="text-sm">{selectedReport.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)} className="h-6 w-6 p-0">
                  ×
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{selectedReport.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Severity:</span>
                  <Badge
                    variant="secondary"
                    style={{ backgroundColor: severityColors[selectedReport.severity], color: "white" }}
                  >
                    {selectedReport.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Coastal Zone:</span>
                  <span className="font-medium">{selectedReport.location.coastalZone}</span>
                </div>

                <div className="flex justify-between">
                  <span>Crowd Score:</span>
                  <Badge variant={selectedReport.crowdScore >= 0.8 ? "default" : "secondary"}>
                    {Math.round(selectedReport.crowdScore * 100)}%
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="font-medium">{selectedReport.source.toUpperCase()}</span>
                </div>
              </div>

              {selectedReport.socialMediaData && (
                <div className="border-t pt-2">
                  <h4 className="text-xs font-semibold mb-1 flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Social Media Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Platform: {selectedReport.socialMediaData.platform}</div>
                    <div>Credibility: {Math.round(selectedReport.socialMediaData.credibilityScore * 100)}%</div>
                    <div>Sentiment: {selectedReport.socialMediaData.sentiment > 0 ? "😊" : "😟"}</div>
                    <div>Virality: {Math.round(selectedReport.socialMediaData.viralityIndex * 100)}%</div>
                  </div>

                  {selectedReport.originalPost && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium mb-1">Original Post:</div>
                      <div className="text-gray-600 italic">
                        "{selectedReport.originalPost.text.substring(0, 100)}..."
                      </div>
                      {selectedReport.originalPost.hashtags && selectedReport.originalPost.hashtags.length > 0 && (
                        <div className="mt-1">
                          <span className="text-blue-600">#{selectedReport.originalPost.hashtags.join(" #")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-2">
                <h4 className="text-xs font-semibold mb-1 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Neural Network Validation
                </h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>Validation: {Math.round(selectedReport.geoFencing.validationScore * 100)}%</div>
                  <div>Network Nodes: {selectedReport.geoFencing.networkNodes}</div>
                  <div>
                    Fake News Risk:
                    <Badge
                      variant="secondary"
                      className={`ml-1 ${
                        selectedReport.geoFencing.fakeNewsRisk === "low"
                          ? "bg-green-100 text-green-800"
                          : selectedReport.geoFencing.fakeNewsRisk === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedReport.geoFencing.fakeNewsRisk.toUpperCase()}
                    </Badge>
                  </div>
                  <div>Radius: {(selectedReport.geoFencing.radius / 1000).toFixed(1)}km</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
