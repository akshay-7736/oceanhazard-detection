"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Legend,
} from "recharts"

const trendData = [
  { month: "Jan", incidents: 45, alerts: 23, accuracy: 92, severity: 2.1 },
  { month: "Feb", incidents: 52, alerts: 28, accuracy: 89, severity: 2.3 },
  { month: "Mar", incidents: 48, alerts: 31, accuracy: 94, severity: 2.0 },
  { month: "Apr", incidents: 61, alerts: 35, accuracy: 91, severity: 2.5 },
  { month: "May", incidents: 58, alerts: 42, accuracy: 93, severity: 2.2 },
  { month: "Jun", incidents: 67, alerts: 38, accuracy: 95, severity: 2.4 },
  { month: "Jul", incidents: 73, alerts: 45, accuracy: 92, severity: 2.8 },
  { month: "Aug", incidents: 69, alerts: 41, accuracy: 94, severity: 2.6 },
  { month: "Sep", incidents: 64, alerts: 39, accuracy: 96, severity: 2.3 },
  { month: "Oct", incidents: 71, alerts: 43, accuracy: 93, severity: 2.7 },
  { month: "Nov", incidents: 76, alerts: 47, accuracy: 95, severity: 2.9 },
  { month: "Dec", incidents: 82, alerts: 52, accuracy: 94, severity: 3.1 },
]

const hazardTypeData = [
  { type: "High Waves", count: 234, trend: 12 },
  { type: "Coastal Flooding", count: 189, trend: -5 },
  { type: "Storm Surge", count: 156, trend: 8 },
  { type: "Seismic Activity", count: 98, trend: 3 },
  { type: "Tsunami", count: 12, trend: -2 },
]

export function TrendAnalysis() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Incident Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Incident & Alert Trends</CardTitle>
          <CardDescription>Monthly incident reports and alert effectiveness over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="incidents" fill="#3b82f6" name="Incidents" opacity={0.8} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Accuracy %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Severity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Trends</CardTitle>
          <CardDescription>Average incident severity and frequency patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="severity"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Avg Severity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hazard Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hazard Type Analysis</CardTitle>
          <CardDescription>Distribution and trends by hazard category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hazardTypeData.map((hazard, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{hazard.type}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(hazard.count / 234) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{hazard.count}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span
                    className={`text-sm font-medium ${
                      hazard.trend > 0 ? "text-red-600" : hazard.trend < 0 ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {hazard.trend > 0 ? "+" : ""}
                    {hazard.trend}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Patterns</CardTitle>
          <CardDescription>Hazard frequency by season and weather conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">Spring</p>
              <p className="text-sm text-muted-foreground">High Waves: 45%</p>
              <p className="text-sm text-muted-foreground">Flooding: 30%</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">Summer</p>
              <p className="text-sm text-muted-foreground">Storm Surge: 60%</p>
              <p className="text-sm text-muted-foreground">Seismic: 25%</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-2xl font-bold text-red-600">Fall</p>
              <p className="text-sm text-muted-foreground">High Waves: 70%</p>
              <p className="text-sm text-muted-foreground">Flooding: 55%</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">Winter</p>
              <p className="text-sm text-muted-foreground">Storm Surge: 40%</p>
              <p className="text-sm text-muted-foreground">Seismic: 35%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
