"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

const waveData = [
  { time: "00:00", height: 2.1, period: 8.2 },
  { time: "02:00", height: 2.4, period: 8.5 },
  { time: "04:00", height: 2.8, period: 9.1 },
  { time: "06:00", height: 3.2, period: 9.8 },
  { time: "08:00", height: 3.8, period: 10.2 },
  { time: "10:00", height: 4.1, period: 10.8 },
  { time: "12:00", height: 4.2, period: 11.1 },
  { time: "14:00", height: 3.9, period: 10.5 },
  { time: "16:00", height: 3.5, period: 9.8 },
  { time: "18:00", height: 3.1, period: 9.2 },
  { time: "20:00", height: 2.8, period: 8.8 },
  { time: "22:00", height: 2.5, period: 8.4 },
]

interface WaveChartProps {
  detailed?: boolean
}

export function WaveChart({ detailed = false }: WaveChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wave Height Monitoring</CardTitle>
        <CardDescription>
          {detailed ? "Detailed 24-hour wave height and period data" : "Real-time wave height data from coastal buoys"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {detailed ? (
              <AreaChart data={waveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}${name === "height" ? "m" : "s"}`,
                    name === "height" ? "Wave Height" : "Wave Period",
                  ]}
                />
                <Area type="monotone" dataKey="height" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Line type="monotone" dataKey="period" stroke="#f59e0b" strokeWidth={2} />
              </AreaChart>
            ) : (
              <LineChart data={waveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}m`, "Wave Height"]} />
                <Line
                  type="monotone"
                  dataKey="height"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        {detailed && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Height</p>
              <p className="text-2xl font-bold text-blue-600">4.2m</p>
            </div>
            <div>
              <p className="text-muted-foreground">Wave Period</p>
              <p className="text-2xl font-bold text-orange-600">11.1s</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
