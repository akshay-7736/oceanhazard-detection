// Test script to verify map data integration
const testMapData = async () => {
  try {
    console.log("🧪 Testing Map Data Integration...")
    
    // Test live data API
    const response = await fetch("http://localhost:3000/api/social/live-data?limit=10&confidence=0.5")
    const data = await response.json()
    
    console.log("✅ Live Data API Response:")
    console.log("- Success:", data.success)
    console.log("- Data Count:", data.data?.length || 0)
    console.log("- Source:", data.source)
    console.log("- Stats:", data.stats)
    
    if (data.data && data.data.length > 0) {
      console.log("\n📍 Sample Report:")
      const sample = data.data[0]
      console.log("- ID:", sample.id)
      console.log("- Title:", sample.title)
      console.log("- Type:", sample.type)
      console.log("- Severity:", sample.severity)
      console.log("- Location:", sample.location)
      console.log("- Geo-fencing:", sample.geoFencing)
      console.log("- Social Media Data:", sample.socialMediaData)
    }
    
    // Test social extraction API
    console.log("\n🔍 Testing Social Extraction API...")
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
    console.log("- Processing Time:", extractData.processing_time)
    
    console.log("\n🎉 Map data integration test completed!")
    
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testMapData()
