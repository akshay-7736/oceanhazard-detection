"use client"

import React, { useEffect, useRef, useState } from "react"
import { AlertTriangle, Waves, Shield, Users, MessageSquare, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface HazardReport {
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
  hazard_analysis?: {
    type: string
    urgency: string
    confidence: number
    locations_mentioned: string[]
  }
  sentiment_analysis?: {
    sentiment_label: string
    polarity: number
    urgency_score: number
    confidence: number
  }
  engagement?: {
    likes: number
    retweets: number
    replies: number
    followers: number
  }
  timestamp: string
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

export const RealMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null)
  const [hazardReports, setHazardReports] = useState<HazardReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [showGeoFencing, setShowGeoFencing] = useState(true)
  const [showSocialMedia, setShowSocialMedia] = useState(true)
  const [showCrowdData, setShowCrowdData] = useState(true)

  useEffect(() => {
    const fetchHazardData = async () => {
      try {
        setIsLoading(true)
        
        // First try to get data from Firebase
        const firebaseResponse = await fetch("/api/social/live-data?limit=50&confidence=0.5")
        const firebaseResult = await firebaseResponse.json()
        
        if (firebaseResult.success && firebaseResult.data.length > 0) {
          // Use Firebase data - already in correct format
          setHazardReports(firebaseResult.data)
          setLastUpdated(new Date().toLocaleTimeString())
          console.log("✅ Loaded", firebaseResult.data.length, "reports from Firebase")
        } else {
          // Fallback to social media extraction API
          const response = await fetch("/api/social/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              keywords: ["tsunami", "flooding", "storm surge", "coastal erosion", "cyclone", "oil spill"],
              platforms: ["all"]
            })
          })
          const result = await response.json()
          
          if (result.success && result.extracted_posts && result.extracted_posts.length > 0) {
            // Process and enhance the data with geo-tagging
            const enhancedReports = result.extracted_posts.map((post: any, index: number) => ({
              id: post.id || `report_${Date.now()}_${index}`,
              title: post.text?.substring(0, 50) + "..." || `Hazard Report ${index + 1}`,
              description: post.text || "No description available",
              type: post.hazard_analysis?.type?.toLowerCase().replace(" ", "_") || "general",
              severity: post.hazard_analysis?.urgency === "high" ? "critical" : 
                       post.hazard_analysis?.urgency === "medium" ? "high" : "medium",
              status: "verified",
              location: {
                latitude: post.location?.lat || (15.0 + (Math.random() - 0.5) * 10),
                longitude: post.location?.lng || (77.0 + (Math.random() - 0.5) * 10),
                address: post.location?.address || `Coastal Area ${index + 1}`,
                coastalZone: `Zone ${String.fromCharCode(65 + (index % 3))}`
              },
              source: post.platform || "social_media",
              hazard_analysis: post.hazard_analysis,
              sentiment_analysis: post.sentiment_analysis,
              engagement: post.engagement,
              timestamp: post.timestamp || new Date().toISOString(),
              geoFencing: {
                radius: 5000 + Math.random() * 10000, // 5-15km radius
                networkNodes: Math.floor(Math.random() * 50) + 10,
                validationScore: post.hazard_analysis?.confidence || 0.7,
                fakeNewsRisk: post.hazard_analysis?.confidence > 0.8 ? "low" : 
                             post.hazard_analysis?.confidence > 0.5 ? "medium" : "high"
              },
              crowdScore: post.engagement ? 
                Math.min(1.0, (post.engagement.likes + post.engagement.retweets) / 1000) : 
                Math.random() * 0.8 + 0.2
            }))
            
            setHazardReports(enhancedReports)
            setLastUpdated(new Date().toLocaleTimeString())
            console.log("✅ Loaded", enhancedReports.length, "enhanced reports from API")
          } else {
            // Final fallback to mock data
            console.log("🔄 Using mock data as final fallback")
            setHazardReports(generateMockHazardData())
            setLastUpdated(new Date().toLocaleTimeString())
          }
        }
      } catch (error) {
        console.error("Error fetching hazard data:", error)
        // Generate mock data as final fallback
        setHazardReports(generateMockHazardData())
        setLastUpdated(new Date().toLocaleTimeString())
      } finally {
        setIsLoading(false)
      }
    }

    fetchHazardData()
    const interval = setInterval(fetchHazardData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize MapLibre GL JS
    const initMap = async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default
        
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: {
            version: 8,
            sources: {
              'raster-tiles': {
                type: 'raster',
                tiles: [
                  'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'simple-tiles',
                type: 'raster',
                source: 'raster-tiles',
                minzoom: 0,
                maxzoom: 22
              }
            ]
          },
          center: [77.0, 15.0], // India center
          zoom: 6
        })

        map.current.on('load', () => {
          addHazardMarkers()
        })

      } catch (error) {
        console.error("Error initializing map:", error)
        // Fallback to canvas-based map
        renderCanvasMap()
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [hazardReports, showGeoFencing, showSocialMedia, showCrowdData])

  const addHazardMarkers = () => {
    if (!map.current) {
      console.log("❌ Map not initialized yet")
      return
    }

    console.log("🗺️ Adding markers for", hazardReports.length, "reports")

    // Clear existing markers and layers
    const existingMarkers = document.querySelectorAll('.hazard-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Remove existing geo-fencing circles
    if (map.current.getLayer('geo-fencing-circles')) {
      map.current.removeLayer('geo-fencing-circles')
    }
    if (map.current.getSource('geo-fencing-circles')) {
      map.current.removeSource('geo-fencing-circles')
    }

    // Add geo-fencing circles if enabled
    if (showGeoFencing) {
      const geoFencingData = {
        type: 'FeatureCollection',
        features: hazardReports.map(report => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [report.location.longitude, report.location.latitude]
          },
          properties: {
            radius: report.geoFencing?.radius || 5000,
            fakeNewsRisk: report.geoFencing?.fakeNewsRisk || 'medium',
            validationScore: report.geoFencing?.validationScore || 0.7
          }
        }))
      }

      map.current.addSource('geo-fencing-circles', {
        type: 'geojson',
        data: geoFencingData
      })

      map.current.addLayer({
        id: 'geo-fencing-circles',
        type: 'circle',
        source: 'geo-fencing-circles',
        paint: {
          'circle-radius': {
            type: 'exponential',
            stops: [
              [0, 0],
              [20, 20]
            ],
            base: 2
          },
          'circle-color': [
            'case',
            ['==', ['get', 'fakeNewsRisk'], 'low'], '#10b981',
            ['==', ['get', 'fakeNewsRisk'], 'medium'], '#f59e0b',
            '#ef4444'
          ],
          'circle-opacity': 0.3,
          'circle-stroke-width': 2,
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'fakeNewsRisk'], 'low'], '#10b981',
            ['==', ['get', 'fakeNewsRisk'], 'medium'], '#f59e0b',
            '#ef4444'
          ],
          'circle-stroke-opacity': 0.8
        }
      })
    }

    // Add hazard markers
    hazardReports.forEach((report, index) => {
      if (!report.location?.latitude || !report.location?.longitude) {
        console.log("⚠️ Skipping report", index, "due to missing location:", report.location)
        return
      }
      
      console.log("📍 Adding marker for report", index, "at", report.location.latitude, report.location.longitude)

      const marker = document.createElement('div')
      marker.className = 'hazard-marker'
      marker.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${severityColors[report.severity]};
        border: 3px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        position: relative;
        z-index: 10;
      `

      marker.innerHTML = hazardIcons[report.type] || "⚠️"

      // Add pulsing animation for critical reports
      if (report.severity === "critical") {
        marker.style.animation = "pulse 2s infinite"
      }

      // Add social media indicator
      if (showSocialMedia && report.source === "social_media") {
        const socialIndicator = document.createElement('div')
        socialIndicator.style.cssText = `
          position: absolute;
          top: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: white;
          font-weight: bold;
        `
        socialIndicator.textContent = 'S'
        marker.appendChild(socialIndicator)
      }

      // Add crowd data indicator
      if (showCrowdData && report.crowdScore) {
        const crowdIndicator = document.createElement('div')
        crowdIndicator.style.cssText = `
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background-color: ${report.crowdScore >= 0.8 ? '#10b981' : report.crowdScore >= 0.6 ? '#f59e0b' : '#ef4444'};
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: white;
          font-weight: bold;
        `
        crowdIndicator.textContent = Math.round(report.crowdScore * 100).toString()
        marker.appendChild(crowdIndicator)
      }

      marker.addEventListener('click', () => {
        setSelectedReport(report)
      })

      new (window as any).maplibregl.Marker(marker)
        .setLngLat([report.location.longitude, report.location.latitude])
        .addTo(map.current)
    })
  }

  const renderCanvasMap = () => {
    // Fallback canvas implementation
    const canvas = document.createElement('canvas')
    canvas.width = mapContainer.current!.offsetWidth
    canvas.height = mapContainer.current!.offsetHeight
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    
    mapContainer.current!.innerHTML = ''
    mapContainer.current!.appendChild(canvas)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple map background
    ctx.fillStyle = "#1e40af"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw hazard markers
    hazardReports.forEach((report, index) => {
      if (!report.location?.latitude || !report.location?.longitude) return

      const x = canvas.width * (0.3 + ((report.location.longitude - 70) / 20) * 0.4)
      const y = canvas.height * (0.8 - ((report.location.latitude - 8) / 20) * 0.6)

      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fillStyle = severityColors[report.severity]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(hazardIcons[report.type] || "⚠️", x, y + 4)
    })
  }

  return (
    <div className="w-full h-full relative bg-slate-900">
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Loading hazard data...</span>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <Button variant="secondary" size="sm" onClick={() => map.current?.zoomIn()}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => map.current?.zoomOut()}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => map.current?.flyTo({ center: [77.0, 15.0], zoom: 6 })}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md space-y-2 z-10">
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
        
        {/* Severity Legend */}
        <div className="border-t pt-2">
          <h5 className="text-xs font-medium mb-1">Severity</h5>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Low</span>
            </div>
          </div>
        </div>
        
        {/* Geo-fencing Legend */}
        {showGeoFencing && (
          <div className="border-t pt-2">
            <h5 className="text-xs font-medium mb-1">Geo-fencing Risk</h5>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Low Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">High Risk</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md z-10">
        <div className="flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400" : "bg-green-400"}`} />
          <span className="text-gray-600">Live Data {lastUpdated && `(Updated: ${lastUpdated})`}</span>
          <span className="text-blue-600 font-medium">{hazardReports.length} Reports</span>
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
                  <span>Type:</span>
                  <span className="font-medium">{selectedReport.type.replace("_", " ")}</span>
                </div>

                {selectedReport.hazard_analysis && (
                  <>
                    <div className="flex justify-between">
                      <span>Urgency:</span>
                      <span className="font-medium">{selectedReport.hazard_analysis.urgency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-medium">{Math.round(selectedReport.hazard_analysis.confidence * 100)}%</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="font-medium">{selectedReport.source.replace("_", " ").toUpperCase()}</span>
                </div>
              </div>

              {selectedReport.sentiment_analysis && (
                <div className="border-t pt-2">
                  <h4 className="text-xs font-semibold mb-1 flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Sentiment Analysis
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Sentiment: {selectedReport.sentiment_analysis.sentiment_label}</div>
                    <div>Polarity: {selectedReport.sentiment_analysis.polarity.toFixed(2)}</div>
                    <div>Urgency: {Math.round(selectedReport.sentiment_analysis.urgency_score * 100)}%</div>
                    <div>Confidence: {Math.round(selectedReport.sentiment_analysis.confidence * 100)}%</div>
                  </div>
                </div>
              )}

              {selectedReport.engagement && (
                <div className="border-t pt-2">
                  <h4 className="text-xs font-semibold mb-1 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Engagement
                  </h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Likes: {selectedReport.engagement.likes}</div>
                    <div>Retweets: {selectedReport.engagement.retweets}</div>
                    <div>Replies: {selectedReport.engagement.replies}</div>
                    <div>Followers: {selectedReport.engagement.followers}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// Mock data generation function
function generateMockHazardData(): HazardReport[] {
  const hazardTypes = ["tsunami", "cyclone", "storm_surge", "coastal_erosion", "oil_spill", "marine_debris", "general"]
  const severities = ["low", "medium", "high", "critical"]
  const sources = ["citizen", "social_media", "sensor", "satellite", "official"]
  const coastalZones = ["Zone A", "Zone B", "Zone C"]
  
  const mockReports: HazardReport[] = []
  
  for (let i = 0; i < 15; i++) {
    const type = hazardTypes[Math.floor(Math.random() * hazardTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    
    // Generate realistic coastal coordinates around India
    const latitude = 15.0 + (Math.random() - 0.5) * 10 // 10-20 degrees N
    const longitude = 77.0 + (Math.random() - 0.5) * 10 // 72-82 degrees E
    
    mockReports.push({
      id: `mock_${Date.now()}_${i}`,
      title: `${type.replace("_", " ").toUpperCase()} Alert - ${coastalZones[i % 3]}`,
      description: `Reported ${type.replace("_", " ")} activity in ${coastalZones[i % 3]}. Immediate attention required.`,
      type: type as any,
      severity: severity as any,
      status: "verified",
      location: {
        latitude,
        longitude,
        address: `Coastal Area ${i + 1}, ${coastalZones[i % 3]}`,
        coastalZone: coastalZones[i % 3]
      },
      source: source as any,
      hazard_analysis: {
        type: type.replace("_", " ").toUpperCase(),
        urgency: severity,
        confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
        locations_mentioned: [coastalZones[i % 3]]
      },
      sentiment_analysis: {
        sentiment_label: Math.random() > 0.5 ? "emergency" : "negative",
        polarity: -Math.random() * 0.8 - 0.2, // -1.0 to -0.2
        urgency_score: Math.random() * 0.5 + 0.5, // 0.5-1.0
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
      },
      engagement: {
        likes: Math.floor(Math.random() * 1000),
        retweets: Math.floor(Math.random() * 500),
        replies: Math.floor(Math.random() * 100),
        followers: Math.floor(Math.random() * 10000) + 1000
      },
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      geoFencing: {
        radius: 5000 + Math.random() * 10000, // 5-15km
        networkNodes: Math.floor(Math.random() * 50) + 10,
        validationScore: Math.random() * 0.4 + 0.6, // 0.6-1.0
        fakeNewsRisk: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
      },
      crowdScore: Math.random() * 0.8 + 0.2 // 0.2-1.0
    })
  }
  
  return mockReports
}

