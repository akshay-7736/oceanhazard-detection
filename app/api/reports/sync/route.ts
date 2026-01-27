import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { pendingReports } = await request.json()
    const syncResults = []

    for (const report of pendingReports) {
      try {
        // Process each offline report
        const processedReport = {
          ...report,
          id: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          syncedAt: new Date().toISOString(),
          status: "synced",
        }

        // Store in database
        console.log("[v0] Syncing offline report:", processedReport)

        syncResults.push({
          localId: report.localId,
          serverId: processedReport.id,
          status: "success",
        })
      } catch (error) {
        syncResults.push({
          localId: report.localId,
          status: "failed",
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      syncResults,
      message: `Synced ${syncResults.filter((r) => r.status === "success").length} reports`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 })
  }
}
