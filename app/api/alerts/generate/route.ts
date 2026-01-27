import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { hazardData, severity, channels, recipients } = await request.json()

    const alertId = `ALT-${Date.now()}`
    const alert = {
      id: alertId,
      type: hazardData.type,
      severity: severity || "medium",
      title: generateAlertTitle(hazardData.type, severity),
      message: generateAlertMessage(hazardData),
      location: hazardData.location,
      channels: channels || ["sms", "email", "push"],
      recipients: recipients || ["all-citizens"],
      deliveryStatus: {
        sms: { sent: 0, delivered: 0, failed: 0 },
        email: { sent: 0, delivered: 0, failed: 0 },
        push: { sent: 0, delivered: 0, failed: 0 },
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    }

    // Mock alert delivery process
    console.log("[v0] Generated alert:", alert)

    return NextResponse.json({
      success: true,
      alert,
      message: "Alert generated and queued for delivery",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Alert generation failed" }, { status: 500 })
  }
}

function generateAlertTitle(type: string, severity: string): string {
  const titles = {
    tsunami: `${severity.toUpperCase()} Tsunami Warning`,
    flood: `${severity.toUpperCase()} Flood Alert`,
    storm: `${severity.toUpperCase()} Storm Warning`,
    earthquake: `${severity.toUpperCase()} Earthquake Alert`,
  }
  return titles[type] || `${severity.toUpperCase()} Hazard Alert`
}

function generateAlertMessage(hazardData: any): string {
  return `A ${hazardData.type} has been detected in ${hazardData.location.address}. Please follow evacuation procedures and stay safe. This is an official emergency alert.`
}
