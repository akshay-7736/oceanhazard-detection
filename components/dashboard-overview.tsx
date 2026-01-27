import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Users, TrendingUp, Map, Navigation, Satellite } from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-balance">Ocean Hazard Management Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          Monitor coastal and ocean hazards in real-time, manage alerts, and coordinate emergency responses.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last hour</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Stations</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">98% operational</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+23% from average</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Map Feature Section */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-cyan-500" />
                Live Hazard Map
              </CardTitle>
              <CardDescription>
                Real-time coastal monitoring with AI-powered geo-fencing and social media integration
              </CardDescription>
            </div>
            <Link href="/map">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-2" />
                Open Full Map
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-sm">Active Geo-Fences</p>
                <p className="text-xs text-muted-foreground">8 coastal zones monitored</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Social Media Feeds</p>
                <p className="text-xs text-muted-foreground">247 verified reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">AI Validation</p>
                <p className="text-xs text-muted-foreground">94% accuracy rate</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recent Map Activity</span>
              <Badge variant="secondary" className="text-xs">
                <Satellite className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
            </div>

            {[
              { event: "Tsunami Alert Geo-Tagged", location: "Bay of Bengal", confidence: "98%", time: "1 min ago" },
              { event: "Cyclone Path Updated", location: "Arabian Sea", confidence: "95%", time: "5 min ago" },
              { event: "Oil Spill Detected", location: "Gulf Coast", confidence: "92%", time: "12 min ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.location}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {activity.confidence}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Hazard Reports</CardTitle>
            <CardDescription>Latest citizen and sensor reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: "Tsunami Warning", location: "Pacific Coast", severity: "Critical", time: "2 min ago" },
              { type: "High Waves", location: "Marina Bay", severity: "High", time: "15 min ago" },
              { type: "Coastal Flooding", location: "Downtown Pier", severity: "Medium", time: "1 hour ago" },
              { type: "Storm Surge", location: "North Beach", severity: "High", time: "2 hours ago" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{report.type}</p>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      report.severity === "Critical"
                        ? "destructive"
                        : report.severity === "High"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {report.severity}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time monitoring system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { system: "Tsunami Detection Network", status: "Operational", uptime: "99.9%" },
              { system: "Weather Monitoring", status: "Operational", uptime: "98.7%" },
              { system: "Social Media Feed", status: "Operational", uptime: "99.2%" },
              { system: "Alert Distribution", status: "Maintenance", uptime: "95.1%" },
            ].map((system, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{system.system}</p>
                  <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                </div>
                <Badge variant={system.status === "Operational" ? "default" : "secondary"}>{system.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
