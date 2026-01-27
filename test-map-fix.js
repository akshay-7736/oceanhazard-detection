// Test script to verify map data is working
const testMapData = async () => {
  try {
    console.log("🧪 Testing Map Data Fix...")
    
    // Test live data API
    console.log("\n1. Testing Live Data API...")
    const response = await fetch("http://localhost:3000/api/social/live-data?limit=10&confidence=0.5")
    const data = await response.json()
    
    console.log("✅ Live Data API Response:")
    console.log("- Success:", data.success)
    console.log("- Data Count:", data.data?.length || 0)
    console.log("- Source:", data.source)
    
    if (data.data && data.data.length > 0) {
      console.log("\n📍 Sample Reports:")
      data.data.slice(0, 3).forEach((report, index) => {
        console.log(`\nReport ${index + 1}:`)
        console.log("- ID:", report.id)
        console.log("- Title:", report.title)
        console.log("- Type:", report.type)
        console.log("- Severity:", report.severity)
        console.log("- Location:", report.location)
        console.log("- Geo-fencing:", report.geoFencing)
      })
    }
    
    // Test social extraction API
    console.log("\n2. Testing Social Extraction API...")
    const extractResponse = await fetch("http://localhost:3000/api/social/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: ["tsunami", "cyclone", "flooding"],
        platforms: ["all"]
      })
    })
    
    const extractData = await extractResponse.json()
    console.log("✅ Social Extraction Response:")
    console.log("- Success:", extractData.success)
    console.log("- Posts Count:", extractData.extracted_posts?.length || 0)
    
    console.log("\n🎉 Map data test completed!")
    console.log("\n📱 Open http://localhost:3000/map to see the map with markers!")
    
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testMapData()
