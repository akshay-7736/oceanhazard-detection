"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

const seismicData = [
  { time: "00:00", magnitude: 1.2, depth: 8 },
  { time: "02:00", magnitude: 0.8, depth: 12 },
  { time: "04:00", magnitude: 1.5, depth: 6 },
  { time: "06:00", magnitude: 2.1, depth: 15 },
  { time: "08:00", magnitude: 1.1, depth: 9 },
  { time: "10:00", magnitude: 0.9, depth: 11 },
  { time: "12:00", magnitude: 1.8, depth: 7 },
  { time: "14:00", magnitude: 2.3, depth: 18 },
  { time: "16:00", magnitude: 1.4, depth: 10 },
  { time: "18:00", magnitude: 1.0, depth: 13 },
  { time: "20:00", magnitude: 1.6, depth: 8 },
  { time: "22:00", magnitude: 1.2, depth: 14 },
]

interface SeismicChartProps {
  detailed?: boolean
}

export function SeismicChart({ detailed = false }: SeismicChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seismic Activity</CardTitle>
        <CardDescription>
          {detailed
            ? "Detailed earthquake magnitude and depth analysis"
            : "Real-time seismic monitoring from regional sensors"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {detailed ? (
              <ScatterChart data={seismicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}${name === "magnitude" ? "M" : "km"}`,
                    name === "magnitude" ? "Magnitude" : "Depth",
                  ]}
                />
                <Scatter dataKey="magnitude" fill="#8b5cf6" />
              </ScatterChart>
            ) : (
              <LineChart data={seismicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}M`, "Magnitude"]} />
                <Line
                  type="monotone"
                  dataKey="magnitude"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        {detailed && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Latest Event</p>
              <p className="text-xl font-bold text-purple-600">2.3M</p>
            </div>
            <div>
              <p className="text-muted-foreground">Depth</p>
              <p className="text-xl font-bold">18km</p>
            </div>
            <div>
              <p className="text-muted-foreground">Events (24h)</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
