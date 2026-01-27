import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SocialMediaExtraction } from "@/components/social-media-extraction"

export default function SocialExtractionPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Social Media Extraction & Analysis</h1>
            <SocialMediaExtraction />
          </div>
        </main>
      </div>
    </div>
  )
}
