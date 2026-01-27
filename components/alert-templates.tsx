"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, Copy } from "lucide-react"

export function AlertTemplates() {
  const templates = [
    {
      id: "TPL-001",
      name: "Tsunami Warning",
      severity: "Critical",
      category: "Tsunami",
      usage: 23,
      lastUsed: "2 days ago",
      preview:
        "TSUNAMI WARNING: A tsunami has been detected. Evacuate coastal areas immediately. Move to higher ground...",
    },
    {
      id: "TPL-002",
      name: "High Wave Advisory",
      severity: "High",
      category: "Wave",
      usage: 45,
      lastUsed: "1 hour ago",
      preview: "HIGH WAVE ADVISORY: Dangerous wave conditions detected. Avoid coastal areas and beaches...",
    },
    {
      id: "TPL-003",
      name: "Coastal Flooding Watch",
      severity: "Medium",
      category: "Flooding",
      usage: 12,
      lastUsed: "1 week ago",
      preview: "COASTAL FLOODING WATCH: Rising water levels may cause flooding in low-lying coastal areas...",
    },
    {
      id: "TPL-004",
      name: "Seismic Activity Alert",
      severity: "Medium",
      category: "Seismic",
      usage: 8,
      lastUsed: "3 days ago",
      preview: "SEISMIC ACTIVITY: Earthquake detected in the region. Monitor for potential aftershocks...",
    },
    {
      id: "TPL-005",
      name: "Storm Surge Warning",
      severity: "High",
      category: "Storm",
      usage: 18,
      lastUsed: "5 days ago",
      preview: "STORM SURGE WARNING: Dangerous storm surge conditions expected. Evacuate low-lying areas...",
    },
    {
      id: "TPL-006",
      name: "System Maintenance",
      severity: "Low",
      category: "System",
      usage: 34,
      lastUsed: "Yesterday",
      preview: "SYSTEM MAINTENANCE: Monitoring systems will be offline for scheduled maintenance...",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Templates</h2>
          <p className="text-muted-foreground">Pre-configured alert messages for quick deployment</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-10" />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    ID: {template.id} • Category: {template.category}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    template.severity === "Critical"
                      ? "destructive"
                      : template.severity === "High"
                        ? "default"
                        : template.severity === "Medium"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {template.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground line-clamp-2">{template.preview}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Used {template.usage} times</span>
                <span>Last used {template.lastUsed}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-3 w-3 mr-1" />
                    Use
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
