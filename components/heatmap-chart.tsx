"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const heatmapData = [
  { hour: 0, day: "Mon", incidents: 2 },
  { hour: 1, day: "Mon", incidents: 1 },
  { hour: 2, day: "Mon", incidents: 0 },
  { hour: 3, day: "Mon", incidents: 1 },
  { hour: 4, day: "Mon", incidents: 3 },
  { hour: 5, day: "Mon", incidents: 5 },
  { hour: 6, day: "Mon", incidents: 8 },
  { hour: 7, day: "Mon", incidents: 12 },
  { hour: 8, day: "Mon", incidents: 15 },
  { hour: 9, day: "Mon", incidents: 18 },
  { hour: 10, day: "Mon", incidents: 22 },
  { hour: 11, day: "Mon", incidents: 25 },
  { hour: 12, day: "Mon", incidents: 28 },
  { hour: 13, day: "Mon", incidents: 24 },
  { hour: 14, day: "Mon", incidents: 20 },
  { hour: 15, day: "Mon", incidents: 16 },
  { hour: 16, day: "Mon", incidents: 14 },
  { hour: 17, day: "Mon", incidents: 18 },
  { hour: 18, day: "Mon", incidents: 22 },
  { hour: 19, day: "Mon", incidents: 19 },
  { hour: 20, day: "Mon", incidents: 15 },
  { hour: 21, day: "Mon", incidents: 12 },
  { hour: 22, day: "Mon", incidents: 8 },
  { hour: 23, day: "Mon", incidents: 5 },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 24 }, (_, i) => i)

export function HeatmapChart() {
  const getIntensityColor = (incidents: number) => {
    const maxIncidents = 30
    const intensity = incidents / maxIncidents
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800"
    if (intensity <= 0.2) return "bg-blue-100 dark:bg-blue-900"
    if (intensity <= 0.4) return "bg-blue-300 dark:bg-blue-700"
    if (intensity <= 0.6) return "bg-orange-300 dark:bg-orange-700"
    if (intensity <= 0.8) return "bg-red-300 dark:bg-red-700"
    return "bg-red-500 dark:bg-red-600"
  }

  // Generate sample data for all days
  const generateHeatmapData = () => {
    const data: { [key: string]: number } = {}
    days.forEach((day) => {
      hours.forEach((hour) => {
        const baseIncidents = Math.floor(Math.random() * 20) + 5
        const timeMultiplier = hour >= 6 && hour <= 18 ? 1.5 : 0.7
        const weekendMultiplier = day === "Sat" || day === "Sun" ? 1.2 : 1
        data[`${day}-${hour}`] = Math.floor(baseIncidents * timeMultiplier * weekendMultiplier)
      })
    })
    return data
  }

  const heatmapFullData = generateHeatmapData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Incident Heatmap</CardTitle>
              <CardDescription>Temporal patterns of hazard incidents by day and hour</CardDescription>
            </div>
            <Select defaultValue="incidents">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incidents">Incident Count</SelectItem>
                <SelectItem value="severity">Average Severity</SelectItem>
                <SelectItem value="response">Response Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Hour labels */}
                <div className="flex mb-2">
                  <div className="w-12"></div>
                  {hours.map((hour) => (
                    <div key={hour} className="w-8 text-xs text-center text-muted-foreground">
                      {hour}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {days.map((day) => (
                  <div key={day} className="flex items-center mb-1">
                    <div className="w-12 text-sm font-medium text-muted-foreground">{day}</div>
                    {hours.map((hour) => {
                      const incidents = heatmapFullData[`${day}-${hour}`] || 0
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`w-8 h-6 mx-px rounded-sm ${getIntensityColor(incidents)} cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`}
                          title={`${day} ${hour}:00 - ${incidents} incidents`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Less</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-300 dark:bg-blue-700 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-300 dark:bg-orange-700 rounded-sm"></div>
                  <div className="w-4 h-4 bg-red-300 dark:bg-red-700 rounded-sm"></div>
                  <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded-sm"></div>
                </div>
                <span className="text-sm text-muted-foreground">More</span>
              </div>
              <div className="text-sm text-muted-foreground">Peak hours: 10 AM - 2 PM</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Incident density by coastal regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: "North Coast", incidents: 234, density: "High" },
                { region: "Central Bay", incidents: 189, density: "Medium" },
                { region: "South Harbor", incidents: 156, density: "Medium" },
                { region: "East Shore", incidents: 98, density: "Low" },
                { region: "West Peninsula", incidents: 67, density: "Low" },
              ].map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-muted-foreground">{region.incidents} incidents</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      region.density === "High"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : region.density === "Medium"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {region.density}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Matrix</CardTitle>
            <CardDescription>Probability vs Impact analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-1 aspect-square">
              {/* Risk matrix grid */}
              {Array.from({ length: 16 }, (_, i) => {
                const row = Math.floor(i / 4)
                const col = i % 4
                const riskLevel =
                  row + col >= 6 ? "high" : row + col >= 4 ? "medium" : row + col >= 2 ? "low" : "minimal"
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-medium ${
                      riskLevel === "high"
                        ? "bg-red-500 text-white"
                        : riskLevel === "medium"
                          ? "bg-orange-400 text-white"
                          : riskLevel === "low"
                            ? "bg-yellow-300 text-black"
                            : "bg-green-300 text-black"
                    }`}
                  >
                    {row === 0 && col === 0 && "L"}
                    {row === 3 && col === 3 && "H"}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Probability →</p>
                <p className="text-muted-foreground">Low to High</p>
              </div>
              <div>
                <p className="font-medium">Impact ↑</p>
                <p className="text-muted-foreground">Low to High</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
