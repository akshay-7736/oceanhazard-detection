"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { WaveChart } from "@/components/wave-chart"
import { SeismicChart } from "@/components/seismic-chart"
import { WeatherChart } from "@/components/weather-chart"
import { LiveFeed } from "@/components/live-feed"
import { SensorGrid } from "@/components/sensor-grid"
import { Activity, Waves, Thermometer, Wind, Eye, AlertCircle } from "lucide-react"

export function MonitoringDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">Real-Time Monitoring</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Live data from ocean sensors, weather stations, and seismic monitors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-red-800 dark:text-red-200">High Wave Alert - Pacific Coast Sector 7</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                Wave heights exceeding 4.2m detected. Coastal flooding risk elevated.
              </p>
            </div>
            <Badge variant="destructive">Critical</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="waves">Wave Data</TabsTrigger>
          <TabsTrigger value="seismic">Seismic</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wave Height</CardTitle>
                <Waves className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2m</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={84} className="flex-1" />
                  <span className="text-xs text-muted-foreground">84%</span>
                </div>
                <p className="text-xs text-red-600 mt-1">Above threshold</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Temp</CardTitle>
                <Thermometer className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.4°C</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={67} className="flex-1" />
                  <span className="text-xs text-muted-foreground">67%</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Normal range</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                <Wind className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 km/h</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={45} className="flex-1" />
                  <span className="text-xs text-muted-foreground">45%</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Moderate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Seismic Activity</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1M</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={21} className="flex-1" />
                  <span className="text-xs text-muted-foreground">21%</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Low activity</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaveChart />
            <SeismicChart />
          </div>

          {/* Live Feed */}
          <LiveFeed />
        </TabsContent>

        <TabsContent value="waves">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WaveChart detailed />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Wave Stations</CardTitle>
                <CardDescription>Real-time buoy data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "B001", location: "North Bay", height: "4.2m", status: "Critical" },
                  { id: "B002", location: "Central Coast", height: "2.8m", status: "Normal" },
                  { id: "B003", location: "South Harbor", height: "3.1m", status: "Elevated" },
                  { id: "B004", location: "Deep Water", height: "2.4m", status: "Normal" },
                ].map((station) => (
                  <div key={station.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{station.id}</p>
                      <p className="text-sm text-muted-foreground">{station.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{station.height}</p>
                      <Badge
                        variant={
                          station.status === "Critical"
                            ? "destructive"
                            : station.status === "Elevated"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {station.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seismic">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SeismicChart detailed />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { magnitude: "2.1M", location: "45km NE of coast", time: "2 hours ago", depth: "12km" },
                  { magnitude: "1.8M", location: "67km SW offshore", time: "4 hours ago", depth: "8km" },
                  { magnitude: "2.3M", location: "23km E of harbor", time: "6 hours ago", depth: "15km" },
                ].map((event, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{event.magnitude}</span>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    <p className="text-sm">{event.location}</p>
                    <p className="text-xs text-muted-foreground">Depth: {event.depth}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather">
          <WeatherChart />
        </TabsContent>

        <TabsContent value="sensors">
          <SensorGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}
