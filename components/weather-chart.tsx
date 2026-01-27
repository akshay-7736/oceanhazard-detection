"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const weatherData = [
  { time: "00:00", windSpeed: 15, pressure: 1013, humidity: 78, temperature: 22 },
  { time: "02:00", windSpeed: 18, pressure: 1012, humidity: 80, temperature: 21 },
  { time: "04:00", windSpeed: 22, pressure: 1011, humidity: 82, temperature: 20 },
  { time: "06:00", windSpeed: 28, pressure: 1009, humidity: 85, temperature: 21 },
  { time: "08:00", windSpeed: 32, pressure: 1008, humidity: 88, temperature: 22 },
  { time: "10:00", windSpeed: 35, pressure: 1007, humidity: 90, temperature: 23 },
  { time: "12:00", windSpeed: 38, pressure: 1006, humidity: 87, temperature: 24 },
  { time: "14:00", windSpeed: 34, pressure: 1007, humidity: 84, temperature: 25 },
  { time: "16:00", windSpeed: 30, pressure: 1008, humidity: 81, temperature: 24 },
  { time: "18:00", windSpeed: 26, pressure: 1009, humidity: 79, temperature: 23 },
  { time: "20:00", windSpeed: 22, pressure: 1010, humidity: 77, temperature: 22 },
  { time: "22:00", windSpeed: 19, pressure: 1011, humidity: 75, temperature: 21 },
]

export function WeatherChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Wind Speed & Pressure</CardTitle>
          <CardDescription>Meteorological conditions affecting wave formation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Wind Speed (km/h)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pressure"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Pressure (hPa)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Temperature & Humidity</CardTitle>
          <CardDescription>Environmental conditions monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="temperature" fill="#ef4444" name="Temperature (°C)" opacity={0.8} />
                <Bar yAxisId="right" dataKey="humidity" fill="#3b82f6" name="Humidity (%)" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
