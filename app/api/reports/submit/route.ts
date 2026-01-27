import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const reportData = {
      id: `RPT-${Date.now()}`,
      userId: formData.get("userId"),
      type: formData.get("type"),
      description: formData.get("description"),
      severity: formData.get("severity"),
      location: {
        lat: Number.parseFloat(formData.get("lat") as string),
        lng: Number.parseFloat(formData.get("lng") as string),
        address: formData.get("address"),
      },
      media: [], // Handle file uploads
      timestamp: new Date().toISOString(),
      status: "pending",
      verified: false,
    }

    // Process uploaded media files
    const mediaFiles = formData.getAll("media") as File[]
    for (const file of mediaFiles) {
      if (file.size > 0) {
        // Mock file storage - replace with Firebase Storage
        reportData.media.push({
          type: file.type.startsWith("image/") ? "image" : "video",
          url: `/uploads/${reportData.id}/${file.name}`,
          filename: file.name,
          size: file.size,
        })
      }
    }

    // Store in database (mock implementation)
    console.log("[v0] Storing hazard report:", reportData)

    return NextResponse.json({
      success: true,
      reportId: reportData.id,
      message: "Report submitted successfully",
    })
  } catch (error) {
    console.error("[v0] Report submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 })
  }
}
