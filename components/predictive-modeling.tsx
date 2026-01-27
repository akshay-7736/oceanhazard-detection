"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const predictionData = [
  { time: "Now", actual: 4.2, predicted: 4.1, confidence: 95 },
  { time: "+1h", actual: null, predicted: 4.5, confidence: 92 },
  { time: "+2h", actual: null, predicted: 4.8, confidence: 88 },
  { time: "+3h", actual: null, predicted: 5.1, confidence: 84 },
  { time: "+4h", actual: null, predicted: 4.9, confidence: 79 },
  { time: "+5h", actual: null, predicted: 4.6, confidence: 75 },
  { time: "+6h", actual: null, predicted: 4.3, confidence: 71 },
]

const riskForecast = [
  { hour: 0, tsunami: 15, flooding: 35, waves: 85, seismic: 25 },
  { hour: 1, tsunami: 18, flooding: 42, waves: 88, seismic: 23 },
  { hour: 2, tsunami: 22, flooding: 48, waves: 92, seismic: 28 },
  { hour: 3, tsunami: 28, flooding: 55, waves: 95, seismic: 31 },
  { hour: 4, tsunami: 25, flooding: 52, waves: 91, seismic: 29 },
  { hour: 5, tsunami: 21, flooding: 45, waves: 87, seismic: 26 },
  { hour: 6, tsunami: 17, flooding: 38, waves: 82, seismic: 24 },
]

export function PredictiveModeling() {
  return (
    <div className="space-y-6">
      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Wave Height Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <Progress value={94.2} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tsunami Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">97.8%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <Progress value={97.8} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Flood Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">91.5%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <Progress value={91.5} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Seismic Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">89.3%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <Progress value={89.3} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wave Height Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Wave Height Prediction</CardTitle>
            <CardDescription>6-hour forecast with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Actual"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-blue-600">Current</p>
                <p className="text-muted-foreground">4.2m</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-orange-600">Peak (3h)</p>
                <p className="text-muted-foreground">5.1m</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-green-600">Confidence</p>
                <p className="text-muted-foreground">84%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Probability Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Probability Forecast</CardTitle>
            <CardDescription>Hazard likelihood over next 6 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="waves"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="High Waves"
                  />
                  <Area
                    type="monotone"
                    dataKey="flooding"
                    stackId="2"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Flooding"
                  />
                  <Area
                    type="monotone"
                    dataKey="tsunami"
                    stackId="3"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Tsunami"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Model Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Insights</CardTitle>
          <CardDescription>Machine learning model analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="destructive">High Risk</Badge>
                <span className="text-sm font-medium">Wave Height Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Model predicts wave heights will exceed 5m threshold in 3 hours. Recommend issuing evacuation alert for
                coastal areas.
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="default">Medium Risk</Badge>
                <span className="text-sm font-medium">Flooding Potential</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tidal conditions and wave action may cause minor flooding in low-lying areas. Monitor drainage systems.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">Information</Badge>
                <span className="text-sm font-medium">Sensor Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Buoy B003 data quality has improved model accuracy by 2.3%. Consider deploying similar sensors in
                adjacent areas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Training Status */}
      <Card>
        <CardHeader>
          <CardTitle>Model Training & Updates</CardTitle>
          <CardDescription>Continuous learning and model improvement status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { model: "Wave Height Predictor", lastTrained: "2 hours ago", accuracy: 94.2, status: "Active" },
              { model: "Tsunami Early Warning", lastTrained: "6 hours ago", accuracy: 97.8, status: "Active" },
              { model: "Flood Risk Assessment", lastTrained: "1 day ago", accuracy: 91.5, status: "Training" },
              { model: "Seismic Activity Predictor", lastTrained: "3 days ago", accuracy: 89.3, status: "Scheduled" },
            ].map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{model.model}</p>
                  <p className="text-sm text-muted-foreground">Last trained: {model.lastTrained}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{model.accuracy}%</p>
                  <Badge
                    variant={
                      model.status === "Active" ? "default" : model.status === "Training" ? "secondary" : "outline"
                    }
                  >
                    {model.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
